import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Version,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { GetProductsQueryParamsDto } from './dto/getProductsQueryParam.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { EditProductDto } from './dto/editProduct.dto';

@Controller('products')
@ApiTags('Product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @Version('')
  async getProducts(
    @Query() getProductsQueryParamsDto: GetProductsQueryParamsDto,
  ): Promise<DefaultResponseDto> {
    const { products, totalEntries } = await this.productService.getProducts(
      getProductsQueryParamsDto,
    );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All products retrived successfully.',
      data: {
        products: products,
        totalEntries: totalEntries,
      },
    };

    return response;
  }

  @Get('discount/:discountId')
  @Version('1')
  async getProductsByDiscountId(
    @Param('discountId') discountId: number,
    @Query() getProductsQueryParamsDto: GetProductsQueryParamsDto,
  ): Promise<DefaultResponseDto> {
    const { products, totalEntries } =
      await this.productService.getProductsByDiscountId(
        getProductsQueryParamsDto,
        discountId,
      );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All products retrived successfully.',
      data: {
        categories: products,
        totalEntries: totalEntries,
      },
    };

    return response;
  }

  @Get('category/:categoryId')
  @Version('1')
  async getProductsByCategoryId(
    @Param('categoryId') categoryId: number,
    @Query() getProductsQueryParamsDto: GetProductsQueryParamsDto,
  ): Promise<DefaultResponseDto> {
    const { products, totalEntries } =
      await this.productService.getProductsByCategoryId(
        getProductsQueryParamsDto,
        categoryId,
      );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All categories retrived successfully.',
      data: {
        categories: products,
        totalEntries: totalEntries,
      },
    };

    return response;
  }

  @Get(':id')
  @Version('1')
  async getProductById(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<DefaultResponseDto> {
    const product = await this.productService.getProductById(productId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Product: '${productId}' retrived successfully`,
      data: product,
    };

    return response;
  }

  //RabbitMQ endpoints
  @MessagePattern({ cmd: 'create-product' })
  async createProduct(
    @Payload() newProductDTo: CreateProductDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.productService.createProduct(newProductDTo);

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'update-product' })
  async updateProduct(
    @Payload() payload: { productId: number; editProductDto: EditProductDto },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.productService.updateProduct(
      payload.productId,
      payload.editProductDto,
    );

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'add-category-product' })
  async addProductToCategory(
    @Payload() payload: { productId: number; categoryId: number },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.productService.addProductToCategory(
      payload.productId,
      payload.categoryId,
    );

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'remove-category-product' })
  async removeProductFromCategory(
    @Payload() payload: { productId: number; categoryId: number },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.productService.removeProductFromCategory(
      payload.productId,
      payload.categoryId,
    );

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'add-discount-product' })
  async addDiscountToProduct(
    @Payload() payload: { productId: number; discountId: number },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.productService.addDiscountToProduct(
      payload.productId,
      payload.discountId,
    );

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'remove-discount-product' })
  async removeDiscountFromProduct(
    @Payload() productId: number,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.productService.removeDiscountFromProduct(productId);

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'delete-product' })
  async deleteProduct(
    @Payload() productId: number,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.productService.deleteProduct(productId);

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'restore-product' })
  async restoreProduct(
    @Payload() productId: number,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.productService.restoreProduct(productId);

    channel.ack(originalMsg);
  }
}
