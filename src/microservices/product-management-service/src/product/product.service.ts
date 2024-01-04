import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductBodyDto } from './dto/productAndInventory.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(private prismaService: PrismaService){}

    async createNewProduct(newProductDto: CreateProductBodyDto){
        try{
            const newProduct = await this.prismaService.product.create({
                data: {
                  ...newProductDto,
                  inventories: {
                    create: newProductDto.inventories, 
                  },
                },include: {
                    inventories: true
                }
              });
            
            return newProduct;
        }catch(e){
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new ConflictException(`Same Color Error (update error message later)`, { cause: e });
                } else {
                    throw new InternalServerErrorException("Something went wrong creating the new product, please try again later", { cause: e });
                }
            } else {
                throw new InternalServerErrorException("Something went wrong creating the new product, please try again later", { cause: e });
            }
        }
    }

    async getAllProducts(){}

    async getAllDeletedProducts(){}

    async getAllProductsWithDiscount(){}

    async getProductById(productId: number){}

    async getProductsByCategoryId(){}

    async getInventoriesByProductId(productId: number){}

    async updateProductById(){}

    async setDiscountOnProduct(){}

    async removeDiscountFromProduct(){}

    async deleteProductById(productId: number){} 

    async restoreProductById(productId: number){}
}
