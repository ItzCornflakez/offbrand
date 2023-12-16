import { Module } from '@nestjs/common';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductModule],
  providers: [ProductService],
})
export class ProductModule {}
