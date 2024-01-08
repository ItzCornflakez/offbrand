import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Version,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';

@Controller('categories')
@ApiTags('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @Version('1')
  async getAllCategories(): Promise<DefaultResponseDto> {
    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Categories retrived successfully`,
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
      statusText: `Category: '${categoryId}' retrived successfully`,
      data: category,
    };

    return response;
  }
}
