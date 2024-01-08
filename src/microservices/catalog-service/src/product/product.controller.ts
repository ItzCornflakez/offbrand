import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Version,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';

@Controller('products')
@ApiTags('Product')
export class ProductController {
  constructor(private productService: ProductService) {}

  /*
  @Get()
  @Version('')
  async getProducts(): Promise<DefaultResponseDto> {
    const { products, totalEntries } = await this.productService.getProducts();

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
  */

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

  /*
  @Get('discount/:discountId')
  @Version('1')
  async getProductsByDiscountId(
    @Param('discountId') discountId: number,
  ): Promise<DefaultResponseDto> {
    const { products, totalEntries } =
      await this.productService.getProductsByDiscountId(discountId);

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

  @Get('category/:categoryId')
  @Version('1')
  async getProductsByCategoryId(
    @Param('categoryId') categoryId: number,
  ): Promise<DefaultResponseDto> {
    const { products, totalEntries } =
      await this.productService.getProductsByCategoryId(categoryId);

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
  */
}
