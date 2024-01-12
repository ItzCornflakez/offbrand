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
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { AuthGuard } from 'src/common/utils/guards/auth.guard';
import { RoleGuard } from 'src/common/utils/guards/roles.guard';
import { Roles } from 'src/common/utils/decorators/roles.decorators';

@Controller('products')
@ApiTags('Products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: `Create a product` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
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
  @ApiOperation({ summary: `Add a new inventory to a product by it's id` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
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
  @ApiOperation({ summary: `Get all products` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
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

  @Get('/deleted')
  @Version('1')
  @ApiOperation({ summary: `Get all deleted products` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
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
  @ApiOperation({ summary: `Get a product by it's id` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
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
  @ApiOperation({
    summary: `Get all products belonging to a dicount by the discount's id`,
  })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
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

  @Get(':id')
  @Version('1')
  @ApiOperation({ summary: `Get a product by it's id` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
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

  @Get(':id/inventories')
  @Version('1')
  @ApiOperation({ summary: `Get all of a products inventories by it's id` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
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
  @ApiOperation({ summary: `Update a product by it's id` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
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
  @ApiOperation({ summary: `Add a product to a category by the category's id` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async addProductToCategoryById(
    @Param('id', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<DefaultResponseDto> {
    const product = await this.productService.addProductToCategoryById(
      productId,
      categoryId,
    );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Product: '${productId}' added to category: '${categoryId}' successfully.`,
      data: product,
    };

    return response;
  }

  @Patch(':id/removeFromCategory/:categoryId')
  @Version('1')
  @ApiOperation({
    summary: `Remove a product to a category by the category's id`,
  })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async removeProductToCategoryById(
    @Param('id', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<DefaultResponseDto> {
    const product = await this.productService.removeProductFromCategoryById(
      productId,
      categoryId,
    );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Product: '${productId}' removed from category: '${categoryId}' successfully.`,
      data: product,
    };

    return response;
  }

  @Patch(':id/applyDiscount/:discountid')
  @Version('1')
  @ApiOperation({ summary: `Add a discount to a product by the discount's id` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async setDiscountOnProduct(
    @Param('id', ParseIntPipe) productId: number,
    @Param('discountid', ParseIntPipe) discountId: number,
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

  @Patch(':id/removeDiscount')
  @Version('1')
  @ApiOperation({
    summary: `Remove a discount to a product by the discount's id`,
  })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
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
  @ApiOperation({ summary: `Delete a product by it's id` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
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
  @ApiOperation({ summary: `Restore a product by it's id` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
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
