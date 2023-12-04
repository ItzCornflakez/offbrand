import {Injectable} from '@nestjs/common';
import { Category, Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService{
    constructor(private prisma: PrismaService) {}

    async product(
        productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
    ): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: productWhereUniqueInput
        })
    }

    async category(
        categoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput,
    ): Promise<Category | null> {
        return this.prisma.category.findUnique({
            where: categoryWhereUniqueInput
        })
    }

    async createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
        return this.prisma.product.create({
          data,
        });
      }

    async createCategory(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({
        data,
    });
    }


}