import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { EditCategoryDto } from './dto/editCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  //Endpoint functions
  async getAllCategories() {
    try {
      const categories = await this.prismaService.category.findMany({
        where: { is_deleted: false },
      });

      return categories;
    } catch (e) {
      throw new InternalServerErrorException('Could not fetch all categories', {
        cause: e,
      });
    }
  }

  async getCategoryById(categoryId: number) {
    try {
      const category = await this.prismaService.category.findUnique({
        where: { id: categoryId, is_deleted: false },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID: '${categoryId}' not found.`,
        );
      }

      return category;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }

      throw new InternalServerErrorException('Failed to fetch category', {
        cause: e,
      });
    }
  }

  //RabbitMQ functions
  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      await this.prismaService.category.create({
        data: { ...createCategoryDto },
      });
    } catch (e) {
      return e;
    }
  }

  async updateCategory(categoryId: number, editCategoryDto: EditCategoryDto) {
    try {
      await this.prismaService.category.update({
        where: { id: categoryId },
        data: { ...editCategoryDto, last_updated_at: new Date() },
      });
    } catch (e) {
      return e;
    }
  }

  async deleteCategory(categoryId: number) {
    try {
      await this.prismaService.category.update({
        where: { id: categoryId },
        data: { is_deleted: true, last_updated_at: new Date() },
      });
    } catch (e) {
      return e;
    }
  }

  async restoreCategory(categoryId: number) {
    try {
      await this.prismaService.category.update({
        where: { id: categoryId },
        data: { is_deleted: false, last_updated_at: new Date() },
      });
    } catch (e) {
      return e;
    }
  }
}
