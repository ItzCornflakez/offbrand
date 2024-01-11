import {
  ConflictException,
  Inject,
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
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CategoryService {
  private rabbitmqEnabled: boolean;
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy,
  ) {
    this.rabbitmqEnabled = this.configService.get<boolean>(
      'PMS_RABBITMQ_ENABLED',
    );
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prismaService.category.findFirst({
        where: { name: createCategoryDto.name },
      });

      if (category) {
        throw new ConflictException(
          `A category with the specified name: '${createCategoryDto.name}' already exists`,
        );
      }

      const createdCategory = await this.prismaService.$transaction([
        this.prismaService.category.create({
          data: { ...createCategoryDto },
        }),
      ]);

      if (this.rabbitmqEnabled) {
        const result = await this.client.send(
          { cmd: 'create-category' },
          createCategoryDto,
        );
        await result.subscribe();
      }

      return createdCategory;
    } catch (e) {
      if (e instanceof ConflictException) {
        throw e;
      }

      throw new InternalServerErrorException(
        'Something went wrong creating the new category, please try again later',
        { cause: e },
      );
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
      const categories = await this.prismaService.category.findMany({
        where: show_deleted ? {} : { is_deleted: false },
        skip,
        take: limit === 0 ? undefined : limit,
      });

      const totalEntries = await this.prismaService.category.count({
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
      const category = await this.prismaService.category.findUnique({
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
      const deletedCategories = await this.prismaService.category.findMany({
        where: { is_deleted: true },
        skip,
        take: limit === 0 ? undefined : limit,
      });

      const totalEntries = await this.prismaService.category.count({
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
      const category = await this.prismaService.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `The category with ID: '${categoryId}' did not exist`,
        );
      }

      const updatedCategory = await this.prismaService.$transaction([
        this.prismaService.category.update({
          where: { id: categoryId },
          data: { ...editCategoryDto, last_updated_at: new Date() },
        }),
      ]);

      if (this.rabbitmqEnabled) {
        const result = await this.client.send(
          { cmd: 'update-category' },
          { categoryId, editCategoryDto },
        );
        await result.subscribe();
      }

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
      const category = await this.prismaService.category.findUnique({
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

      await this.prismaService.category.update({
        where: { id: categoryId },
        data: {
          is_deleted: true,
          last_updated_at: new Date(),
        },
      });

      if (this.rabbitmqEnabled) {
        const result = await this.client.send(
          { cmd: 'delete-category' },
          categoryId,
        );
        await result.subscribe();
      }
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
      const category = await this.prismaService.category.findUnique({
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

      await this.prismaService.category.update({
        where: { id: categoryId },
        data: {
          is_deleted: false,
          last_updated_at: new Date(),
        },
      });

      if (this.rabbitmqEnabled) {
        const result = await this.client.send(
          { cmd: 'restore-category' },
          categoryId,
        );
        await result.subscribe();
      }
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
