import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  //Endpoint functions
  async getProducts() {}

  async getProductById(productId: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: productId, is_deleted: false },
        include: {
          variants: true,
        },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found.`);
      }

      return product;
    } catch (e) {
      throw new InternalServerErrorException('Failed to fetch product', {
        cause: e,
      });
    }
  }
  /*
  async getProductsByDiscountId(discountId: number) {}

  async getProductsByCategoryId(categoryId: number) {}
  */

  //RabbitMQ functions
  async createProduct() {}

  async updateProduct() {}

  async addDiscountToProduct() {}

  async removeDiscountFromProduct() {}

  async addProductToCategory() {}

  async removeProductFromCategory() {}

  async deleteProduct() {}

  async restoreProduct() {}
}
