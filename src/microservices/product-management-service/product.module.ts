import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';

@Module({
    controllers: [ProductController],
  imports: [],
  providers: []
})
export class ProductModule {}
