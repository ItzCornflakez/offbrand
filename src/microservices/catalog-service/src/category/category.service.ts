import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  //Endpoint functions
  async getAllCategories() {}

  async getCategoryById(categoryId: number) {
    try {
      const category = await this.prismaService.category.findUnique({
        where: { id: categoryId, is_deleted: false },
      });

      if (!category) {
        throw new NotFoundException(`Product with ID ${categoryId} not found.`);
      }

      return category;
    } catch (e) {
      throw new InternalServerErrorException('Failed to fetch category', {
        cause: e,
      });
    }
  }

  //RabbitMQ functions
  async createCategory() {}

  async updateCategory() {}

  async deleteCategory() {}

  async restoreCategory() {}
}
