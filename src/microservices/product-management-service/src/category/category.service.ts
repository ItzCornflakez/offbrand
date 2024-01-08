import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/createCategoryBody.dto';
import { EditCategoryDto } from './dto/editCategoryBody.dto';
import { Prisma } from '@prisma/client';
import {
  GetAllCategoriesQueryParamsDto,
  GetAllDeletedCategoriesQueryParamsDto,
} from './dto/queryParams.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const createdCategory = await this.prisma.category.create({
        data: { ...createCategoryDto },
      });
      return createdCategory;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException(
            `A category with the specified name: ${createCategoryDto.name} already exists`,
            { cause: e },
          );
        } else {
          throw new InternalServerErrorException(
            'Something went wrong creating the new category, please try again later',
            { cause: e },
          );
        }
      } else {
        throw new InternalServerErrorException(
          'Something went wrong creating the new category, please try again later',
          { cause: e },
        );
      }
    }
  }

  async getAllCategories(
    allCategoriesQueryParamsDto: GetAllCategoriesQueryParamsDto,
  ) {
    //Default to default value if the query param is undefined
    const show_deleted = allCategoriesQueryParamsDto.show_deleted ?? true;
    const page = allCategoriesQueryParamsDto.page ?? 1;
    const limit = allCategoriesQueryParamsDto.limit ?? 0;

    const skip = (page - 1) * limit;

    try {
      const categories = await this.prisma.category.findMany({
        where: show_deleted ? {} : { is_deleted: false },
        skip,
        take: limit === 0 ? undefined : limit,
      });

      const totalEntries = await this.prisma.category.count({
        where: show_deleted ? {} : { is_deleted: false },
      });

      return { categories, totalEntries };
    } catch (e) {
      throw new InternalServerErrorException(
        'Failed to retrieve categories. Please try again later.',
        { cause: e },
      );
    }
  }

  async getCategoryById(categoryId: number) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `The category with ID: '${categoryId}' does not exist`,
        );
      }

      return category;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Failed to retrieve category with ID: '${categoryId}'. Please try again later.`,
        { cause: e },
      );
    }
  }

  async getAllDeletedCategories(
    allDeletedCategoriesQueryParamsDto: GetAllDeletedCategoriesQueryParamsDto,
  ) {
    //Default to default value if the query param is undefined
    const page = allDeletedCategoriesQueryParamsDto.page ?? 1;
    const limit = allDeletedCategoriesQueryParamsDto.limit ?? 0;

    const skip = (page - 1) * limit;

    try {
      const deletedCategories = await this.prisma.category.findMany({
        where: { is_deleted: true },
        skip,
        take: limit === 0 ? undefined : limit,
      });

      const totalEntries = await this.prisma.category.count({
        where: { is_deleted: true },
      });

      return { deletedCategories, totalEntries };
    } catch (e) {
      throw new InternalServerErrorException(
        'Failed to retrieve all deleted categories. Please try again later.',
        { cause: e },
      );
    }
  }

  async updateCategoryById(
    categoryId: number,
    editCategoryDto: EditCategoryDto,
  ) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `The category with ID: '${categoryId}' did not exist`,
        );
      }

      const updatedCategory = await this.prisma.category.update({
        where: { id: categoryId },
        data: { ...editCategoryDto, last_updated_at: new Date() },
      });
      return updatedCategory;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException(
            `A category with the specified name: ${editCategoryDto.name} already exists`,
            { cause: e },
          );
        } else {
          throw new InternalServerErrorException(
            `Something went wrong updating category: '${categoryId}' `,
            { cause: e },
          );
        }
      } else {
        if (e instanceof NotFoundException) {
          throw e;
        }

        throw new InternalServerErrorException(
          `Something went wrong updating category: '${categoryId}' `,
          { cause: e },
        );
      }
    }
  }

  async deleteCategoryById(categoryId: number) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `The category with ID: '${categoryId}' did not exist`,
        );
      }

      if (category.is_deleted) {
        throw new ConflictException(
          `The category with ID: '${categoryId}' is already deleted`,
        );
      }

      await this.prisma.category.update({
        where: { id: categoryId },
        data: {
          is_deleted: true,
          last_updated_at: new Date(),
        },
      });
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ConflictException) {
        throw e;
      }

      throw new InternalServerErrorException(
        `Failed to delete categorie with id: '${categoryId}'. Please try again later.`,
        { cause: e },
      );
    }
  }

  async restoreDeletedCategoryById(categoryId: number) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `The category with ID: '${categoryId}' did not exist`,
        );
      }

      if (!category.is_deleted) {
        throw new ConflictException(
          `The category with ID: '${categoryId}' is not deleted`,
        );
      }

      await this.prisma.category.update({
        where: { id: categoryId },
        data: {
          is_deleted: false,
          last_updated_at: new Date(),
        },
      });
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ConflictException) {
        throw e;
      }
      throw new InternalServerErrorException(
        `Failed to restore categorie with ID: '${categoryId}'. Please try again later.`,
        { cause: e },
      );
    }
  }
}
