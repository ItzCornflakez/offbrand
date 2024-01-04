import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Version } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';
import { CreateProductBodyDto } from './dto/productAndInventory.dto';

@Controller('products')
@ApiTags('Products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Version('1')
  async createNewProduct(@Body() newProductDto: CreateProductBodyDto): Promise<DefaultResponseDto>{
    const newProduct = await this.productService.createNewProduct(newProductDto);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.CREATED,
      statusText: 'Product created successfully',
      data: newProduct,
    }

    return response
  }

  @Post()
  @Version('1')
  async addNewInventoryToProductById(){}

  /*
  @Get()
  @Version('1')
  async getAllProducts(): Promise<DefaultResponseDto>{
    const {products, totalEntries} = await this.productService.getAllProducts();

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Product(s) retrived successfully.',
      data: {
          discounts: products,
          totalEntries: totalEntries,
      }
    };

    return response;
  }

  @Get(':id/deleted')
  @Version('1')
  async getAllDeletedProducts(): Promise<DefaultResponseDto>{
    const {deletedProducts, totalEntries} = await this.productService.getAllDeletedProducts();

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Product(s) retrived successfully.',
      data: {
          discounts: deletedProducts,
          totalEntries: totalEntries,
      }
    };

    return response;
  }

  @Get('/discounts')
  @Version('1')
  async getAllProductsWithDiscounts(): Promise<DefaultResponseDto>{
    const {products, totalEntries} = await this.productService.getAllProductsWithDiscount();

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Product(s) retrived successfully.',
      data: {
          discounts: products,
          totalEntries: totalEntries,
      }
    };

    return response;
  }

  @Get(':id')
  @Version('1')
  async getProductById(@Param('id', ParseIntPipe) productId: number): Promise<DefaultResponseDto>{
    const product = await this.productService.getProductById(productId);
    
    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Product with id: '${productId}' retrived successfully`,
      data: product,
    }

    return response   
  }

  @Get('/category/:id')
  @Version('1')
  async getProductsByCategoryId(): Promise<DefaultResponseDto>{
    const {products, totalEntries} = await this.productService.getProductsByCategoryId();

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Product(s) retrived successfully.',
      data: {
          discounts: products,
          totalEntries: totalEntries,
      }
    };

    return response;
  }

  @Get(':id/inventory')
  @Version('1')
  async getInventoriesRelatedToProduct(@Param('id', ParseIntPipe) productId: number): Promise<DefaultResponseDto>{
    const inventories = await this.productService.getInventoriesByProductId(productId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Inventories realated to product with id: '${productId}', retrived successfully`,
      data: inventories,
    }

    return response   
  }

  @Put(':id')
  @Version('1')
  async updateProductById(@Param('id', ParseIntPipe) productId: number): Promise<DefaultResponseDto>{
    const updatedProduct = await this.productService.updateProductById();

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Product '${productId}' was updated successfully.`,
      data: updatedProduct,
    };
  
    return response;
  }

  @Patch(':id/addDiscount/:discountid')
  @Version('1')
  async setDiscountOnProduct(): Promise<DefaultResponseDto>{
    const product = await this.productService.setDiscountOnProduct();

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Discount: '${discountId}' added to product: '${productId}' successfully`,
      data: product,
  };
  
  return response;
  }

  @Patch(':id/removeDiscount/:discountid')
  @Version('1')
  async removeDiscountFromProduct(): Promise<DefaultResponseDto>{
    const product = await this.productService.removeDiscountFromProduct();

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Discount: '${discountId}' removed from product: '${productId}' successfully`,
      data: product,
    };
  
    return response;
  }

  @Patch(':id/delete')
  @Version('1')
  async deleteProductById(@Param('id', ParseIntPipe) productId: number): Promise<DefaultResponseDto>{
    await this.productService.deleteProductById(productId);
  
    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Product '${productId}' and it's relatable inventories were deleted successfully.`,
    };

    return response;
  }

  @Patch(':id/restore')
  @Version('1')
  async restoreProductById(@Param('id', ParseIntPipe) productId: number): Promise<DefaultResponseDto>{
    await this.productService.restoreProductById(productId);
  
    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Product '${productId}' and it's relatable inventories were restored successfully.`,
    };

    return response;
  }
  */
}
