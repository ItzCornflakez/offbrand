import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  async createCategory(
    @Body() dto: CreateCategoryDto,
  ): Promise<DefaultResponseDto> {
    const createdCategory = await this.categoryService.createCategory(dto);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusText: 'Category created successfully',
      data: createdCategory,
    };

    return response;
  }

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }
}
