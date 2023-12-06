import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductsService } from './product.service';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [ProductController],
  imports: [],
  providers: [ProductsService, PrismaService],
})
export class ProductModule {}
