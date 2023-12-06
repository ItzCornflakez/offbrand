import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from './product.service';
import {
  Product as ProductModel,
  Category as CategoryModel,
  Inventory as InventoryModel,
} from '@prisma/client';

@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductsService) {}

  // CREATE ENDPOINTS

  @Post('product')
  async createProduct(
    @Body()
    productData: {
      category: { connect: { id: number } };
      name: string;
      desc: string;
      price: number;
      discount: number;
      picture: string;
      average_score: string;
    },
  ): Promise<ProductModel> {
    return this.productService.createProduct(productData);
  }

  @Post('category')
  async createCategory(
    @Body() categoryData: { 
      name: string;
      desc: string
    },
  ): Promise<CategoryModel> {
    return this.productService.createCategory(categoryData);
  }

  @Post('inventory')
  async createInventory(
    @Body() inventoryData: { product: { connect: { id: number } }; quantity:   number;
      color:      string; },
  ): Promise<InventoryModel> {
    return this.productService.createInventory(inventoryData);
  }

  // UPDATE ENDPOINTS

  @Put('product/:id')
  async updateProduct(
    @Param('id') id: string, 
    @Body()
    productData: {
      category?: { connect: { id: number } };
      name?: string;
      desc?: string;
      price?: number;
      discount?: number;
      picture?: string;
      average_score?: string;
    }, ): Promise<ProductModel> {
    return this.productService.updateProduct({
      where: { id: Number(id) },
      data: { 
        name: productData.name,
        desc: productData.desc,
        price: productData.price,
        discount: productData.discount,
        picture: productData.picture,
        average_score: productData.average_score,
      },
    });
  }

  
  @Put('category/:id')
  async updateCategory(
    @Param('id') id: string, 
    @Body() 
    categoryData: { 
      name?: string;
      desc?: string;
    },
      ): Promise<CategoryModel> {
    return this.productService.updateCategory({
      where: { id: Number(id) },
      data: { 
        name: categoryData.name,
        desc: categoryData.desc,
      },
    });
  }


  @Put('inventory/:id')
  async updateInventory(
    @Param('id') id: string, 
    @Body() 
    inventoryData: { 
      quantity?: number;
      color?: string;
    },
      ): Promise<InventoryModel> {
    return this.productService.updateInventory({
      where: { id: Number(id) },
      data: { 
        quantity: inventoryData.quantity,
        color: inventoryData.color,
      },
    });
  }

  // DELETE ENDPOINTS

  @Delete('product/:id')
  async deleteProduct(@Param('id') id: string): Promise<ProductModel> {
    return this.productService.deleteProduct({ id: Number(id) });
  }

  @Delete('category/:id')
  async deleteCategory(@Param('id') id: string): Promise<CategoryModel> {
    return this.productService.deleteCategory({ id: Number(id) });
  }

  @Delete('inventory/:id')
  async deleteInventory(@Param('id') id: string): Promise<InventoryModel> {
    return this.productService.deleteInventory({ id: Number(id) });
  }

  // GET ENDPOINTS 

  @Get('product/:id')
  async getProductById(@Param('id') id: string): Promise<ProductModel> {
    return this.productService.product({ id: Number(id) });
  }

  @Get('category/:id')
  async getCategoryById(@Param('id') id: string): Promise<CategoryModel> {
    return this.productService.category({ id: Number(id) });
  }

  @Get('inventory/:id')
  async getInventoryById(@Param('id') id: string): Promise<InventoryModel> {
    return this.productService.inventory({ id: Number(id) });
  }

  @Get('products')
  async getProducts(): Promise<ProductModel[]> {
    return this.productService.products({
      where: {is_deleted: false},
    });
  }

  @Get('categories')
  async getCategories(): Promise<CategoryModel[]> {
    return this.productService.categories({
      where: {is_deleted: false},
    });
  }

  @Get('inventories')
  async getInventories(): Promise<InventoryModel[]> {
    return this.productService.inventories({
      where: {},
    });
  }

}