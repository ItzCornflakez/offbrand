import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()

export class ProductService {
constructor(private prisma: PrismaService,
    @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy) {}


    async createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
        
        const createdProduct = await this.prisma.product.create({
        data,
        });

        const result = await this.client.send({cmd: 'create-product' }, {product_id: createdProduct.id});
        await result.subscribe();

        return createdProduct;
    }

}
