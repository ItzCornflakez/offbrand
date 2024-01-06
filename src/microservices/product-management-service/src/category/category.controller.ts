import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Patch,
  Version,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategoryBody.dto';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';
import { EditCategoryDto } from './dto/editCategoryBody.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  GetAllCategoriesQueryParamsDto,
  GetAllDeletedCategoriesQueryParamsDto,
} from './dto/queryParams.dto';

@Controller('categories')
@ApiTags('Category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @Version('1')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<DefaultResponseDto> {
    const createdCategory =
      await this.categoryService.createCategory(createCategoryDto);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.CREATED,
      statusText: 'Category created successfully.',
      data: createdCategory,
    };

    return response;
  }

  @Get()
  @Version('1')
  async getAllCategories(
    @Query() allCategoriesQueryParamsDto: GetAllCategoriesQueryParamsDto,
  ): Promise<DefaultResponseDto> {
    const { categories, totalEntries } =
      await this.categoryService.getAllCategories(allCategoriesQueryParamsDto);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All categories retrived successfully.',
      data: {
        categories: categories,
        totalEntries: totalEntries,
      },
    };

    return response;
  }

  @Get(':id')
  @Version('1')
  async getCategoryById(
    @Param('id', ParseIntPipe) categoryId: number,
  ): Promise<DefaultResponseDto> {
    const category = await this.categoryService.getCategoryById(categoryId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Category with id: '${categoryId}' retrived successfully.`,
      data: category,
    };

    return response;
  }

  @Get('/deleted')
  @Version('1')
  async getAllDeletedCategories(
    @Query()
    allDeletedCategoriesQueryParamsDto: GetAllDeletedCategoriesQueryParamsDto,
  ): Promise<DefaultResponseDto> {
    const { deletedCategories, totalEntries } =
      await this.categoryService.getAllDeletedCategories(
        allDeletedCategoriesQueryParamsDto,
      );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All deleted categories retrived successfully.',
      data: {
        categories: deletedCategories,
        totalEntries: totalEntries,
      },
    };

    return response;
  }

  @Put(':id')
  @Version('1')
  async updateCategoryById(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() editCategoryDto: EditCategoryDto,
  ): Promise<DefaultResponseDto> {
    const updatedCategory = await this.categoryService.updateCategoryById(
      categoryId,
      editCategoryDto,
    );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Category '${categoryId}' was updated successfully.`,
      data: updatedCategory,
    };

    return response;
  }

  @Patch(':id/delete')
  @Version('1')
  async deleteCategoryById(
    @Param('id', ParseIntPipe) categoryId: number,
  ): Promise<DefaultResponseDto> {
    await this.categoryService.deleteCategoryById(categoryId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Category '${categoryId}' was deleted successfully.`,
    };

    return response;
  }

  @Patch(':id/restore')
  @Version('1')
  async restoreDeletedCategoryById(
    @Param('id', ParseIntPipe) categoryId: number,
  ): Promise<DefaultResponseDto> {
    await this.categoryService.restoreDeletedCategoryById(categoryId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Category '${categoryId}' was restored successfully.`,
    };

    return response;
  }
}
