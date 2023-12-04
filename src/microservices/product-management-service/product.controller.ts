import { Body, Controller, Post } from "@nestjs/common";
import { ProductsService } from "./product.service";
import { Product as ProductModel, Category as CategoryModel } from "@prisma/client";

@Controller()
export class ProductController {

    constructor(
        private readonly productService: ProductsService,

    ) {}

    @Post('product')
    async createProduct(
        @Body() productData: { category: {connect: {id: number}}; name: string; desc: string;
             price: number; discount: number; picture: string;
            average_score: string;
            },
    ): Promise<ProductModel> {
        return this.productService.createProduct(productData)
    }

    @Post('category')
    async createCategory(
        @Body() categoryData: { name: string; desc: string;
        },

    ): Promise<CategoryModel> {
        return this.productService.createCategory(categoryData)
    }
}
