import {
  ConflictException,
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

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async createNewProduct(newProductDto: CreateProductBodyDto) {
    try {
      const newProduct = await this.prismaService.product.create({
        data: {
          ...newProductDto,
          inventories: {
            create: newProductDto.inventories,
          },
        },
        include: {
          inventories: true,
        },
      });

      return newProduct;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException(
            'Cannot create the new product because two or more of the provided inventories share the same color. Each inventory must have a unique color for the product.',
            { cause: e },
          );
        } else {
          throw new InternalServerErrorException(
            'Something went wrong creating the new product, please try again later.',
            { cause: e },
          );
        }
      } else {
        throw new InternalServerErrorException(
          'Something went wrong creating the new product, please try again later.',
          { cause: e },
        );
      }
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

      if (product.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the inventory with ID '${productId}' because it is marked as deleted.`,
        );
      }

      const updatedProduct = await this.prismaService.product.update({
        where: { id: productId },
        data: {
          inventories: {
            create: createInventoryBodyDto,
          },
        },
      });

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
            'Something went wrong creating the new product, please try again later.',
            { cause: e },
          );
        }
      } else {
        throw new InternalServerErrorException(
          'Something went wrong creating the new product, please try again later.',
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
        },
      });

      if (!product) {
        throw new NotFoundException(
          `Cannot retrive the product with ID: '${productId}' because it does not exist.`,
        );
      }

      return product;
    } catch (e) {
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

      if (category.is_deleted) {
        throw new ConflictException(
          `Cannot retrive products related to the category with ID: '${categoryId}' because it is marked as deleted.`,
        );
      }

      //Default to default value if the query param is undefined
      const show_deleted = getProductsQueryParamsDto.show_deleted ?? true;
      const page = getProductsQueryParamsDto.page ?? 1;
      const limit = getProductsQueryParamsDto.limit ?? 0;

      const skip = (page - 1) * limit;

      const products = await this.prismaService.product.findMany({
        where: show_deleted
          ? { category_id: categoryId }
          : { category_id: categoryId, is_deleted: false },
        skip,
        take: limit === 0 ? undefined : limit,
        include: {
          inventories: true,
        },
      });

      const totalEntries = await this.prismaService.product.count({
        where: show_deleted
          ? { category_id: categoryId }
          : { category_id: categoryId, is_deleted: false },
      });

      return { products, totalEntries };
    } catch (e) {
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

      if (discount.is_deleted) {
        throw new ConflictException(
          `Cannot retrive products related to the discount with ID: '${discountId}' because it is marked as deleted.`,
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
          `Cannot retrive inventories related to the product with id '${productId}' because it does not exist.`,
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
        include: { inventories: true },
      });

      if (!product) {
        throw new NotFoundException(
          `Cannot perform the operation on the product with ID '${productId}' because it does not exist.`,
        );
      }

      if (product.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the product with ID '${productId}' because it is marked as deleted.`,
        );
      }

      const updatedProduct = await this.prismaService.$transaction([
        this.prismaService.product.update({
          where: { id: productId },
          data: { ...editProductBodyDto, last_updated_at: new Date() },
          include: {
            inventories: true,
          },
        }),
      ]);

      return updatedProduct;
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to update the product with id: '${productId}'. Please try again later.`,
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
          `Cannot perform the operation on the product with ID '${productId}' because it does not exist.`,
        );
      }

      if (product.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the product with ID '${productId}' because it is marked as deleted.`,
        );
      }

      const discount = await this.prismaService.discount.findUnique({
        where: { id: discountId },
      });

      if (!discount) {
        throw new NotFoundException(
          `Cannot perform the operation on the product with ID '${productId}' because the discount with ID: ${discountId} does not exist.`,
        );
      }

      if (discount.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the product with ID '${productId}' because the discount with ID: ${discountId} is marked as deleted.`,
        );
      }

      const updatedProduct = await this.prismaService.$transaction([
        this.prismaService.product.update({
          where: { id: productId },
          data: { discount_id: discountId, last_updated_at: new Date() },
          include: { inventories: true },
        }),
      ]);

      return updatedProduct;
    } catch (e) {
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
          `Cannot perform the operation on the product with ID '${productId}' because it does not exist.`,
        );
      }

      if (product.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the product with ID '${productId}' because it is marked as deleted.`,
        );
      }

      if (product.discount_id === null || product.discount_id === undefined) {
        throw new ConflictException(
          `Cannot perform the operation on the product with ID '${productId}' because no discount is currently applied to the product.`,
        );
      }

      const updatedProduct = await this.prismaService.$transaction([
        this.prismaService.product.update({
          where: { id: productId },
          data: { discount_id: null, last_updated_at: new Date() },
        }),
      ]);

      return updatedProduct;
    } catch (e) {
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
          `Cannot perform the operation on the product with ID '${productId}' because it does not exist.`,
        );
      }

      if (product.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the inventory with ID '${productId}' because it is already marked as deleted.`,
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
    } catch (e) {
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
          `Cannot perform the operation on the product with ID '${productId}' because it does not exist.`,
        );
      }

      if (product.is_deleted) {
        throw new ConflictException(
          `Cannot perform the operation on the inventory with ID '${productId}' because it is already marked as deleted.`,
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
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to restore the product with ID: '${productId}'. Please try again later.`,
        { cause: e },
      );
    }
  }
}
