import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateInventoryBodyDto,
  CreateProductBodyDto,
} from './dto/productAndInventory.dto';
import { Prisma } from '@prisma/client';
import {
  GetAllProductsQueryParamsDto,
  GetProductsQueryParamsDto,
} from './dto/queryParams.dto';
import { EditProductBodyDto } from './dto/editProductBody.dto';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductVariantBodyDto } from './dto/createProductVariant.dto';

@Injectable()
export class ProductService {
  private rabbitmqEnabled: boolean;
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    @Inject('PRODUCT_SERVICE_CATALOG')
    private readonly catalogClient: ClientProxy,
    @Inject('PRODUCT_SERVICE_OMS') private readonly omsClient: ClientProxy,
    @Inject('PRODUCT_SERVICE_RMS') private readonly rmsClient: ClientProxy,
  ) {
    this.rabbitmqEnabled = this.configService.get<boolean>(
      'PMS_RABBITMQ_ENABLED',
    );
  }

  async createNewProduct(newProductDto: CreateProductBodyDto) {
    try {
      const { category_id: categoryId, ...rest } = newProductDto;

      const existingCategory = await this.prismaService.category.findUnique({
        where: { id: categoryId },
      });

      if (!existingCategory) {
        throw new NotFoundException(
          `Cannot create the new product because the category with ID: ${categoryId} does not exist.`,
        );
      }

      // Check if same color, ugly solution but time forbids a better one for now since it will be a problem with rabbitMQ
      const inventories = newProductDto.inventories;
      let nullColorEncountered = false;
      const colors: (string | null)[] = [];
      for (const inventory of inventories) {
        console.log(inventory);
        const color = inventory?.color;

        if (color === null) {
          if (nullColorEncountered) {
            throw new ConflictException('More than one null color found');
          }
          nullColorEncountered = true;
        } else if (colors.includes(color)) {
          throw new ConflictException(`Duplicate color found: ${color}`);
        }

        colors.push(color);
      }

      const newProduct = await this.prismaService.product.create({
        data: {
          ...rest,
          inventories: {
            create: newProductDto.inventories,
          },
          categories: {
            create: {
              category: {
                connect: {
                  id: categoryId,
                },
              },
            },
          },
        },
        include: {
          inventories: true,
          categories: true,
        },
      });

      if (this.rabbitmqEnabled) {
        const catalogProduct = {
          name: newProductDto.name,
          category_id: newProductDto.category_id,
          discount_id: newProductDto.discount_id,
          desc: newProductDto.desc,
          price: newProductDto.price,
          picture: newProductDto.picture,
          variants: newProductDto.inventories.map((inventory) => {
            const variant = new CreateProductVariantBodyDto();
            variant.color = inventory.color;
            return variant;
          }),
        };

        //Send to catalog microservice
        const catalogResult = await this.catalogClient.send(
          { cmd: 'create-product' },
          catalogProduct,
        );
        await catalogResult.subscribe();

        //Send to Order micro service
        const omsResult = await this.omsClient.send(
          { cmd: 'create-product' },
          {},
        );
        await omsResult.subscribe();

        //Send to reviewMicroService
        const rmsResult = await this.rmsClient.send(
          { cmd: 'create-product' },
          {},
        );
        await rmsResult.subscribe();
      }

      return newProduct;
    } catch (e) {
      if (e instanceof ConflictException) {
        throw e;
      }

      throw new InternalServerErrorException(
        'Something went wrong creating the new product, please try again later.',
        { cause: e },
      );
    }
  }

  async addNewInvetoryToProductById(
    productId: number,
    createInventoryBodyDto: CreateInventoryBodyDto,
  ) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Cannot perform the operation on the product with ID '${productId}' because it does not exist.`,
        );
      }

      const updatedProduct = await this.prismaService.product.update({
        where: { id: productId },
        data: {
          inventories: {
            create: createInventoryBodyDto,
          },
        },
        include: {
          inventories: true,
        },
      });

      if (this.rabbitmqEnabled) {
        const color: string | null = createInventoryBodyDto.color;

        const result = await this.catalogClient.send(
          { cmd: 'create-variant' },
          { productId, createVariantDto: { color } },
        );
        await result.subscribe();
      }

      return updatedProduct;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException(
            'Cannot add the new inventory because this product already have an inventory with the provided color. Each inventory must have a unique color for the product.',
            { cause: e },
          );
        } else {
          throw new InternalServerErrorException(
            `Something went wrong updating the product with ID: '${productId}' , please try again later.`,
            { cause: e },
          );
        }
      } else {
        if (e instanceof NotFoundException) {
          throw e;
        }

        throw new InternalServerErrorException(
          `Something went wrong updating the product with ID: '${productId}' , please try again later.`,
          { cause: e },
        );
      }
    }
  }

  async getAllProducts(
    getAllProductsQueryParamsDto: GetAllProductsQueryParamsDto,
  ) {
    //Default to default value if the query param is undefined
    const show_deleted = getAllProductsQueryParamsDto.show_deleted ?? true;
    const page = getAllProductsQueryParamsDto.page ?? 1;
    const limit = getAllProductsQueryParamsDto.limit ?? 0;

    const skip = (page - 1) * limit;

    try {
      const products = await this.prismaService.product.findMany({
        where: show_deleted ? {} : { is_deleted: false },
        skip,
        take: limit === 0 ? undefined : limit,
        include: {
          inventories: true,
          categories: {
            select: { category_id: true },
          },
        },
      });

      const totalEntries = await this.prismaService.product.count({
        where: show_deleted ? {} : { is_deleted: false },
      });

      return { products, totalEntries };
    } catch (e) {
      throw new InternalServerErrorException(
        'Something went wrong retriving the products, please try again later.',
        { cause: e },
      );
    }
  }

  async getAllDeletedProducts(
    getProductsQueryParamsDto: GetProductsQueryParamsDto,
  ) {
    //Default to default value if the query param is undefined
    const page = getProductsQueryParamsDto.page ?? 1;
    const limit = getProductsQueryParamsDto.limit ?? 0;

    const skip = (page - 1) * limit;

    try {
      const products = await this.prismaService.product.findMany({
        where: { is_deleted: true },
        skip,
        take: limit === 0 ? undefined : limit,
        include: {
          inventories: true,
        },
      });

      const totalEntries = await this.prismaService.product.count({
        where: { is_deleted: true },
      });

      return { products, totalEntries };
    } catch (e) {
      throw new InternalServerErrorException(
        'Something went wrong retriving the products, please try again later.',
        { cause: e },
      );
    }
  }

  async getProductById(productId: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: productId },
        include: {
          inventories: true,
          categories: {
            select: {
              category_id: true,
            },
          },
        },
      });

      if (!product) {
        throw new NotFoundException(
          `Cannot retrive the product with ID: '${productId}' because it does not exist.`,
        );
      }

      return product;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Failed to retrieve product with ID: '${productId}'. Please try again later.`,
        { cause: e },
      );
    }
  }

  async getProductsByCategoryId(
    categoryId: number,
    getProductsQueryParamsDto: GetAllProductsQueryParamsDto,
  ) {
    try {
      const category = await this.prismaService.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Cannot retrive products related to the category with ID: '${categoryId}' because it does not exist.`,
        );
      }

      //Default to default value if the query param is undefined
      const show_deleted = getProductsQueryParamsDto.show_deleted ?? true;
      const page = getProductsQueryParamsDto.page ?? 1;
      const limit = getProductsQueryParamsDto.limit ?? 0;

      const skip = (page - 1) * limit;

      const products = await this.prismaService.product.findMany({
        where: show_deleted
          ? { categories: { some: { category_id: categoryId } } }
          : {
              categories: { some: { category_id: categoryId } },
              is_deleted: false,
            },
        skip,
        take: limit === 0 ? undefined : limit,
        include: {
          inventories: true,
        },
      });

      const totalEntries = await this.prismaService.product.count({
        where: show_deleted
          ? { categories: { some: { category_id: categoryId } } }
          : {
              categories: { some: { category_id: categoryId } },
              is_deleted: false,
            },
      });

      return { products, totalEntries };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Failed to retrieve products related to the category with ID: '${categoryId}'. Please try again later.`,
        { cause: e },
      );
    }
  }

  async getProductsByDiscountId(
    discountId: number,
    getProductsQueryParamsDto: GetAllProductsQueryParamsDto,
  ) {
    try {
      const discount = await this.prismaService.discount.findUnique({
        where: { id: discountId },
      });

      if (!discount) {
        throw new NotFoundException(
          `Cannot retrive products related to the discount with ID: '${discountId}' because it does not exist.`,
        );
      }

      //Default to default value if the query param is undefined
      const show_deleted = getProductsQueryParamsDto.show_deleted ?? true;
      const page = getProductsQueryParamsDto.page ?? 1;
      const limit = getProductsQueryParamsDto.limit ?? 0;

      const skip = (page - 1) * limit;

      const products = await this.prismaService.product.findMany({
        where: show_deleted
          ? { discount_id: discountId }
          : { discount_id: discountId, is_deleted: false },
        skip,
        take: limit === 0 ? undefined : limit,
        include: {
          inventories: true,
        },
      });

      const totalEntries = await this.prismaService.product.count({
        where: show_deleted
          ? { discount_id: discountId }
          : { discount_id: discountId, is_deleted: false },
      });

      return { products, totalEntries };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Failed to retrieve products related to the discount with ID: '${discountId}'. Please try again later.`,
        { cause: e },
      );
    }
  }

  async getInventoriesByProductId(productId: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Cannot retrive inventories related to the product with ID: '${productId}' because it does not exist.`,
        );
      }

      const inventories = await this.prismaService.product.findMany({
        where: { id: productId },
        select: {
          inventories: true,
        },
      });

      return inventories;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Failed to retrieve inventories related to the product with ID: '${productId}'. Please try again later.`,
        { cause: e },
      );
    }
  }

  async updateProductById(
    productId: number,
    editProductBodyDto: EditProductBodyDto,
  ) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Cannot perform the operation on the product with ID: '${productId}' because it does not exist.`,
        );
      }

      const updatedProduct = await this.prismaService.$transaction([
        this.prismaService.product.update({
          where: { id: productId },
          data: { ...editProductBodyDto, last_updated_at: new Date() },
          include: {
            inventories: true,
            categories: {
              select: {
                category_id: true,
              },
            },
          },
        }),
      ]);

      if (this.rabbitmqEnabled) {
        const result = await this.catalogClient.send(
          { cmd: 'update-product' },
          { productId, editProductDto: editProductBodyDto },
        );
        await result.subscribe();
      }

      return updatedProduct;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Failed to update the product with ID: '${productId}'. Please try again later.`,
        { cause: e },
      );
    }
  }

  async addProductToCategoryById(productId: number, categoryId: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Cannot perform the operation on the product with ID: '${productId}' because it does not exist.`,
        );
      }

      const category = await this.prismaService.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Cannot perform the operation on the product with ID: '${productId}' because the catecory with ID: '${categoryId}' does not exist.`,
        );
      }

      const updatedProduct = await this.prismaService.$transaction([
        this.prismaService.product.update({
          where: { id: productId },
          data: {
            categories: {
              create: {
                category: {
                  connect: {
                    id: categoryId,
                  },
                },
              },
            },
          },
          include: {
            inventories: true,
            categories: {
              select: {
                category_id: true,
              },
            },
          },
        }),
      ]);

      if (this.rabbitmqEnabled) {
        const result = await this.catalogClient.send(
          { cmd: 'add-category-product' },
          { productId, categoryId },
        );
        await result.subscribe();
      }

      return updatedProduct;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException(
            `Cannot add the product with ID: '${productId}' to category with ID: '${categoryId}' because the product already belongs to that category.`,
            { cause: e },
          );
        } else {
          throw new InternalServerErrorException(
            `Something went wrong updating the product with ID: '${productId}' , please try again later.`,
            { cause: e },
          );
        }
      } else {
        if (e instanceof NotFoundException) {
          throw e;
        }

        throw new InternalServerErrorException(
          `Something went wrong updating the product with ID: '${productId}' , please try again later.`,
          { cause: e },
        );
      }
    }
  }

  async removeProductFromCategoryById(productId: number, categoryId: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: {
          id: productId,
          categories: { some: { category_id: categoryId } },
        },
      });

      if (!product) {
        throw new NotFoundException(
          `Cannot perform the operation on the product with ID: '${productId}' because either the product does not exist or it does not belong to category: '${categoryId}.`,
        );
      }

      const category = await this.prismaService.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Cannot perform the operation on the product with ID: '${productId}' because the catecory with ID: '${categoryId}' does not exist.`,
        );
      }

      if (category.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the product with ID: '${productId}' because the category with ID: '${categoryId}' is marked as deleted.`,
        );
      }

      const NrOfCategoriesLeft = await this.prismaService.productCategory.count(
        {
          where: {
            product_id: productId,
          },
        },
      );

      //If this is the last category associated with the product, throw an error
      if (NrOfCategoriesLeft === 1) {
        throw new ConflictException(
          `Cannot remove the product with ID '${productId}' from the category with ID: '${categoryId}', because it is the last category that this product belongs to.`,
        );
      }

      const updatedProduct = await this.prismaService.$transaction([
        this.prismaService.productCategory.delete({
          where: {
            product_id_category_id: {
              product_id: productId,
              category_id: categoryId,
            },
          },
        }),
      ]);

      if (this.rabbitmqEnabled) {
        const result = await this.catalogClient.send(
          { cmd: 'remove-category-product' },
          { productId, categoryId },
        );
        await result.subscribe();
      }

      return updatedProduct;
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ConflictException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Failed to remove the product with ID: '${productId}' from the category with ID: '${categoryId}'. Please try again later.`,
        { cause: e },
      );
    }
  }

  async applyDiscountOnProductById(productId: number, discountId: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Cannot perform the operation on the product with ID: '${productId}' because it does not exist.`,
        );
      }

      const discount = await this.prismaService.discount.findUnique({
        where: { id: discountId },
      });

      if (!discount) {
        throw new NotFoundException(
          `Cannot perform the operation on the product with ID: '${productId}' because the discount with ID: ${discountId} does not exist.`,
        );
      }

      if (discount.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the product with ID: '${productId}' because the discount with ID: ${discountId} is marked as deleted.`,
        );
      }

      const updatedProduct = await this.prismaService.$transaction([
        this.prismaService.product.update({
          where: { id: productId },
          data: { discount_id: discountId, last_updated_at: new Date() },
          include: { inventories: true },
        }),
      ]);

      if (this.rabbitmqEnabled) {
        const result = await this.catalogClient.send(
          { cmd: 'add-discount-product' },
          { productId, discountId },
        );
        await result.subscribe();
      }

      return updatedProduct;
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ConflictException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Failed to apply discount with ID: '${discountId}' to the product with ID: '${productId}'. Please try again later.`,
        { cause: e },
      );
    }
  }

  async removeDiscountFromProductById(productId: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Cannot perform the operation on the product with ID: '${productId}' because it does not exist.`,
        );
      }

      if (product.discount_id === null || product.discount_id === undefined) {
        throw new ConflictException(
          `Cannot perform the operation on the product with ID: '${productId}' because no discount is currently applied to the product.`,
        );
      }

      const updatedProduct = await this.prismaService.$transaction([
        this.prismaService.product.update({
          where: { id: productId },
          data: { discount_id: null, last_updated_at: new Date() },
        }),
      ]);

      if (this.rabbitmqEnabled) {
        const result = await this.catalogClient.send(
          { cmd: 'remove-discount-product' },
          productId,
        );
        await result.subscribe();
      }

      return updatedProduct;
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ConflictException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Failed to remove the applied discount from the product with ID: '${productId}'. Please try again later.`,
        { cause: e },
      );
    }
  }

  async deleteProductById(productId: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Cannot perform the operation on the product with ID: '${productId}' because it does not exist.`,
        );
      }

      if (product.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the inventory with ID: '${productId}' because it is already marked as deleted.`,
        );
      }

      await this.prismaService.$transaction([
        this.prismaService.product.update({
          where: { id: productId },
          data: { is_deleted: true, last_updated_at: new Date() },
        }),

        this.prismaService.inventory.updateMany({
          where: { product_id: productId, is_deleted: false },
          data: { is_deleted: true, last_updated_at: new Date() },
        }),
      ]);

      if (this.rabbitmqEnabled) {
        const result = await this.catalogClient.send(
          { cmd: 'delete-product' },
          productId,
        );
        await result.subscribe();
      }
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ConflictException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Failed to delete the product with ID: '${productId}'. Please try again later.`,
        { cause: e },
      );
    }
  }

  async restoreProductById(productId: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Cannot perform the operation on the product with ID: '${productId}' because it does not exist.`,
        );
      }

      if (!product.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the inventory with ID: '${productId}' because it is not marked as deleted.`,
        );
      }

      await this.prismaService.$transaction([
        this.prismaService.product.update({
          where: { id: productId },
          data: { is_deleted: false, last_updated_at: new Date() },
        }),

        this.prismaService.inventory.updateMany({
          where: { product_id: productId },
          data: { is_deleted: false, last_updated_at: new Date() },
        }),
      ]);

      if (this.rabbitmqEnabled) {
        const result = await this.catalogClient.send(
          { cmd: 'restore-product' },
          productId,
        );
        await result.subscribe();
      }
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ConflictException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Failed to restore the product with ID: '${productId}'. Please try again later.`,
        { cause: e },
      );
    }
  }
}
