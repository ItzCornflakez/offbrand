import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetProductsQueryParamsDto } from './dto/getProductsQueryParam.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { EditProductDto } from './dto/editProduct.dto';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  //Endpoint functions
  async getProducts(getProductsQueryParamsDto: GetProductsQueryParamsDto) {
    console.log(getProductsQueryParamsDto);
    const page = getProductsQueryParamsDto.page ?? 1;
    const limit = getProductsQueryParamsDto.limit ?? 0;
    const search = getProductsQueryParamsDto.search ?? '';

    const skip = (page - 1) * limit;

    try {
      const products = await this.prismaService.product.findMany({
        where: {
          is_deleted: false,
          name: {
            contains: search,
          },
        },
        skip,
        take: limit === 0 ? undefined : limit,
      });

      const totalEntries = await this.prismaService.product.count({
        where: {
          is_deleted: false,
          name: {
            contains: search,
          },
        },
      });

      return { products, totalEntries };
    } catch (e) {
      throw new InternalServerErrorException(`Failed to fetch products`, {
        cause: e,
      });
    }
  }

  async getProductById(productId: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: productId, is_deleted: false },
        include: {
          variants: true,
        },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID: ${productId} not found.`);
      }

      return product;
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to fetch product with ID: ${productId}`,
        {
          cause: e,
        },
      );
    }
  }

  async getProductsByDiscountId(
    getProductsQueryParamsDto: GetProductsQueryParamsDto,
    discountId: number,
  ) {
    const page = getProductsQueryParamsDto.page ?? 1;
    const limit = getProductsQueryParamsDto.limit ?? 0;
    const search = getProductsQueryParamsDto.search ?? '';

    const skip = (page - 1) * limit;
    try {
      const discount = await this.prismaService.discount.findUnique({
        where: { id: discountId },
      });

      if (!discount) {
        throw new NotFoundException(
          `could not fetch products related to category ${discountId} because it does not exist`,
        );
      }

      if (discount.is_deleted) {
        throw new ConflictException(
          `could not fetch products related to category ${discountId} because it is marked as deleted`,
        );
      }

      if (!discount.is_active) {
        throw new ConflictException(
          `could not fetch products related to category ${discountId} because it is not active`,
        );
      }

      const products = await this.prismaService.product.findMany({
        where: {
          is_deleted: false,
          name: {
            contains: search,
          },
          discount_id: discountId,
        },
        skip,
        take: limit === 0 ? undefined : limit,
      });

      const totalEntries = await this.prismaService.product.count({
        where: {
          is_deleted: false,
          name: {
            contains: search,
          },
          discount_id: discountId,
        },
      });

      return { products, totalEntries };
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ConflictException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Failed to retrieve products related to the discount with ID: '${discountId}'. Please try again later.`,
        { cause: e },
      );
    }
  }

  async getProductsByCategoryId(
    getProductsQueryParamsDto: GetProductsQueryParamsDto,
    categoryId: number,
  ) {
    const page = getProductsQueryParamsDto.page ?? 1;
    const limit = getProductsQueryParamsDto.limit ?? 0;
    const search = getProductsQueryParamsDto.search ?? '';

    const skip = (page - 1) * limit;
    try {
      const category = await this.prismaService.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `could not fetch products related to category ${categoryId} because it does not exist`,
        );
      }

      if (category.is_deleted) {
        throw new ConflictException(
          `could not fetch products related to category ${categoryId} because it is marked as deleted`,
        );
      }

      const products = await this.prismaService.product.findMany({
        where: {
          is_deleted: false,
          name: {
            contains: search,
          },
          categories: { some: { category_id: categoryId } },
        },
        skip,
        take: limit === 0 ? undefined : limit,
      });

      const totalEntries = await this.prismaService.product.count({
        where: {
          is_deleted: false,
          name: {
            contains: search,
          },
          categories: { some: { category_id: categoryId } },
        },
      });

      return { products, totalEntries };
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ConflictException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Failed to retrieve products related to the category with ID: '${categoryId}'. Please try again later.`,
        { cause: e },
      );
    }
  }

  //RabbitMQ functions
  async createProduct(newProductDto: CreateProductDto) {
    try {
      const { category_id: categoryId, ...rest } = newProductDto;

      await this.prismaService.product.create({
        data: {
          ...rest,
          variants: {
            create: newProductDto.variants,
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
      });
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async updateProduct(productId: number, editProductDto: EditProductDto) {
    try {
      await this.prismaService.product.update({
        where: { id: productId },
        data: { ...editProductDto },
      });
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async addProductToCategory(productId: number, categoryId: number) {
    try {
      await this.prismaService.product.update({
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
      });
    } catch (e) {
      return e;
    }
  }

  async removeProductFromCategory(productId: number, categoryId: number) {
    try {
      await this.prismaService.productCategory.delete({
        where: {
          product_id_category_id: {
            product_id: productId,
            category_id: categoryId,
          },
        },
      });
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async addDiscountToProduct(productId: number, discountId: number) {
    try {
      await this.prismaService.product.update({
        where: { id: productId },
        data: { discount_id: discountId, last_updated_at: new Date() },
      });
    } catch (e) {
      return e;
    }
  }

  async removeDiscountFromProduct(productId: number) {
    try {
      await this.prismaService.product.update({
        where: { id: productId },
        data: { discount_id: null, last_updated_at: new Date() },
      });
    } catch (e) {
      return e;
    }
  }

  async deleteProduct(productId: number) {
    try {
      await this.prismaService.$transaction([
        this.prismaService.product.update({
          where: { id: productId },
          data: { is_deleted: true, last_updated_at: new Date() },
        }),

        this.prismaService.variants.updateMany({
          where: { product_id: productId, is_deleted: false },
          data: { is_deleted: true, last_updated_at: new Date() },
        }),
      ]);
    } catch (e) {
      return e;
    }
  }

  async restoreProduct(productId: number) {
    try {
      await this.prismaService.$transaction([
        this.prismaService.product.update({
          where: { id: productId },
          data: { is_deleted: false, last_updated_at: new Date() },
        }),

        this.prismaService.variants.updateMany({
          where: { product_id: productId, is_deleted: true },
          data: { is_deleted: false, last_updated_at: new Date() },
        }),
      ]);
    } catch (e) {
      return e;
    }
  }
}
