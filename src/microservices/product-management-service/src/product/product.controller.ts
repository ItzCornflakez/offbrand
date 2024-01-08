import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';

import { Product as ProductModel} from '@prisma/client';
import { ProductDto } from 'src/common/dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  
  @Post()
  async createProduct(
    @Body() dto: ProductDto
  ): Promise<ProductModel> {

    return this.productService.createProduct(dto);
  }

}
