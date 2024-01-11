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
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategoryBody.dto';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';
import { EditCategoryDto } from './dto/editCategoryBody.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  GetAllCategoriesQueryParamsDto,
  GetAllDeletedCategoriesQueryParamsDto,
} from './dto/queryParams.dto';
import { AuthGuard } from 'src/common/utils/guards/auth.guard';
import { RoleGuard } from 'src/common/utils/guards/roles.guard';
import { Roles } from 'src/common/utils/decorators/roles.decorators';

@Controller('categories')
@Roles('admin')
@UseGuards(AuthGuard, RoleGuard)
@ApiTags('Category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create a category' })
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
  @ApiOperation({ summary: 'Get all categories' })
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

  @Get('/deleted')
  @Version('1')
  @ApiOperation({ summary: 'Get all of the deleted categories' })
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

  @Get(':id')
  @Version('1')
  @ApiOperation({ summary: `Get a category by it's id` })
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

  @Put(':id')
  @Version('1')
  @ApiOperation({ summary: 'Update a category' })
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
  @ApiOperation({ summary: 'Delete a category' })
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
  @ApiOperation({ summary: 'Restore a deleted category' })
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
