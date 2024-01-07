import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Version,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';
import {
  CreateProductBodyDto,
  CreateInventoryBodyDto,
} from './dto/productAndInventory.dto';
import {
  GetAllProductsQueryParamsDto,
  GetProductsQueryParamsDto,
} from './dto/queryParams.dto';
import { EditProductBodyDto } from './dto/editProductBody.dto';

@Controller('products')
@ApiTags('Products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Version('1')
  async createNewProduct(
    @Body() newProductBodyDto: CreateProductBodyDto,
  ): Promise<DefaultResponseDto> {
    const newProduct =
      await this.productService.createNewProduct(newProductBodyDto);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.CREATED,
      statusText: 'Product created successfully.',
      data: newProduct,
    };

    return response;
  }

  @Post(':id/createNewInventory')
  @Version('1')
  async addNewInventoryToProductById(
    @Param('id', ParseIntPipe) productId: number,
    @Body() newInventoryBodyDto: CreateInventoryBodyDto,
  ): Promise<DefaultResponseDto> {
    const updatedProduct =
      await this.productService.addNewInvetoryToProductById(
        productId,
        newInventoryBodyDto,
      );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.CREATED,
      statusText: `A new Inventory was added to '${productId}' successfully.`,
      data: updatedProduct,
    };

    return response;
  }

  @Get()
  @Version('1')
  async getAllProducts(
    @Query() getAllProductsQueryParamsDto: GetAllProductsQueryParamsDto,
  ): Promise<DefaultResponseDto> {
    const { products, totalEntries } = await this.productService.getAllProducts(
      getAllProductsQueryParamsDto,
    );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Product retrived successfully.',
      data: {
        discounts: products,
        totalEntries: totalEntries,
      },
    };

    return response;
  }

  @Get(':id')
  @Version('1')
  async getProductById(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<DefaultResponseDto> {
    const product = await this.productService.getProductById(productId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Product with ID: '${productId}' retrived successfully.`,
      data: product,
    };

    return response;
  }

  @Get('/deleted')
  @Version('1')
  async getAllDeletedProducts(
    @Query() getProductsQueryParamsDto: GetProductsQueryParamsDto,
  ): Promise<DefaultResponseDto> {
    const { products, totalEntries } =
      await this.productService.getAllDeletedProducts(
        getProductsQueryParamsDto,
      );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Product(s) retrived successfully.',
      data: {
        discounts: products,
        totalEntries: totalEntries,
      },
    };

    return response;
  }

  @Get('/categories/:categoryId')
  @Version('1')
  async getProductsByCategoryId(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query() getProductsQueryParamsDto: GetProductsQueryParamsDto,
  ): Promise<DefaultResponseDto> {
    const { products, totalEntries } =
      await this.productService.getProductsByCategoryId(
        categoryId,
        getProductsQueryParamsDto,
      );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Product(s) retrived successfully.',
      data: {
        discounts: products,
        totalEntries: totalEntries,
      },
    };

    return response;
  }

  @Get('/discounts/:discountId')
  @Version('1')
  async getProductsByDiscountId(
    @Param('discountId', ParseIntPipe) discountId: number,
    @Query() getProductsQueryParamsDto: GetProductsQueryParamsDto,
  ): Promise<DefaultResponseDto> {
    const { products, totalEntries } =
      await this.productService.getProductsByDiscountId(
        discountId,
        getProductsQueryParamsDto,
      );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Product(s) retrived successfully.',
      data: {
        discounts: products,
        totalEntries: totalEntries,
      },
    };

    return response;
  }

  @Get(':id/inventories')
  @Version('1')
  async getInventoriesRelatedToProduct(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<DefaultResponseDto> {
    const inventories =
      await this.productService.getInventoriesByProductId(productId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Inventories realated to product with ID: '${productId}' retrived successfully.`,
      data: inventories,
    };

    return response;
  }

  @Put(':id')
  @Version('1')
  async updateProductById(
    @Param('id', ParseIntPipe) productId: number,
    @Body() editProductBodyDto: EditProductBodyDto,
  ): Promise<DefaultResponseDto> {
    const updatedProduct = await this.productService.updateProductById(
      productId,
      editProductBodyDto,
    );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Product: '${productId}' was updated successfully.`,
      data: updatedProduct,
    };

    return response;
  }

  @Patch(':id/addToCategory/:categoryId')
  @Version('1')
  async addProductToCategoryById(
    @Param('id', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<DefaultResponseDto>{
    const product = await this.productService.addProductToCategoryById(productId, categoryId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Product: '${productId}' added to category: '${categoryId}' successfully.`,
      data: product,
    };

    return response;
  }

  @Patch(':id/removeFromCategoy/:categoyId')
  @Version('1')
  async removeProductToCategoryById(
    @Param('id', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<DefaultResponseDto>{
    await this.productService.removeProductFromCategoryById(productId, categoryId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Product: '${productId}' removed from category: '${categoryId}' successfully.`,
    };

    return response;
  }

  @Patch(':id/applyDiscount/:discountid')
  @Version('1')
  async setDiscountOnProduct(
    @Param('id', ParseIntPipe) productId: number,
    @Param('discountId', ParseIntPipe) discountId: number,
  ): Promise<DefaultResponseDto> {
    const product = await this.productService.applyDiscountOnProductById(
      productId,
      discountId,
    );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Discount: '${discountId}' applied to product: '${productId}' successfully.`,
      data: product,
    };

    return response;
  }

  @Patch(':id/removeDiscount/:discountid')
  @Version('1')
  async removeDiscountFromProductById(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<DefaultResponseDto> {
    const product =
      await this.productService.removeDiscountFromProductById(productId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Discont removed from product: '${productId}' successfully`,
      data: product,
    };

    return response;
  }

  @Patch(':id/delete')
  @Version('1')
  async deleteProductById(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<DefaultResponseDto> {
    await this.productService.deleteProductById(productId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Product: '${productId}' and it's relatable inventories were deleted successfully.`,
    };

    return response;
  }

  @Patch(':id/restore')
  @Version('1')
  async restoreProductById(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<DefaultResponseDto> {
    await this.productService.restoreProductById(productId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Product: '${productId}' and it's relatable inventories were restored successfully.`,
    };

    return response;
  }
}
