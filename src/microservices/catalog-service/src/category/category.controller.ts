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
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { EditCategoryDto } from './dto/editCategory.dto';

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

  @MessagePattern({ cmd: 'create-category' })
  async createCategory(
    @Payload() createCategoryDto: CreateCategoryDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.categoryService.createCategory(createCategoryDto);

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'update-category' })
  async updateCategory(
    @Payload()
    payload: { categoryId: number; editCategoryDto: EditCategoryDto },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.categoryService.updateCategory(
      payload.categoryId,
      payload.editCategoryDto,
    );

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'delete-category' })
  async deleteCategory(
    @Payload() categoryId: number,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.categoryService.deleteCategory(categoryId);

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'restore-category' })
  async restoreCategory(
    @Payload() categoryId: number,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.categoryService.restoreCategory(categoryId);

    channel.ack(originalMsg);
  }
}
