"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_service_1 = require("./product.service");
const productAndInventory_dto_1 = require("./dto/productAndInventory.dto");
const queryParams_dto_1 = require("./dto/queryParams.dto");
const editProductBody_dto_1 = require("./dto/editProductBody.dto");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async createNewProduct(newProductBodyDto) {
        const newProduct = await this.productService.createNewProduct(newProductBodyDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.CREATED,
            statusText: 'Product created successfully.',
            data: newProduct,
        };
        return response;
    }
    async addNewInventoryToProductById(productId, newInventoryBodyDto) {
        const updatedProduct = await this.productService.addNewInvetoryToProductById(productId, newInventoryBodyDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.CREATED,
            statusText: `A new Inventory was added to '${productId}' successfully.`,
            data: updatedProduct,
        };
        return response;
    }
    async getAllProducts(getAllProductsQueryParamsDto) {
        const { products, totalEntries } = await this.productService.getAllProducts(getAllProductsQueryParamsDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: 'Product retrived successfully.',
            data: {
                discounts: products,
                totalEntries: totalEntries,
            },
        };
        return response;
    }
    async getAllDeletedProducts(getProductsQueryParamsDto) {
        const { products, totalEntries } = await this.productService.getAllDeletedProducts(getProductsQueryParamsDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: 'Product(s) retrived successfully.',
            data: {
                discounts: products,
                totalEntries: totalEntries,
            },
        };
        return response;
    }
    async getProductsByCategoryId(categoryId, getProductsQueryParamsDto) {
        const { products, totalEntries } = await this.productService.getProductsByCategoryId(categoryId, getProductsQueryParamsDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: 'Product(s) retrived successfully.',
            data: {
                discounts: products,
                totalEntries: totalEntries,
            },
        };
        return response;
    }
    async getProductsByDiscountId(discountId, getProductsQueryParamsDto) {
        const { products, totalEntries } = await this.productService.getProductsByDiscountId(discountId, getProductsQueryParamsDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: 'Product(s) retrived successfully.',
            data: {
                discounts: products,
                totalEntries: totalEntries,
            },
        };
        return response;
    }
    async getProductById(productId) {
        const product = await this.productService.getProductById(productId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Product with ID: '${productId}' retrived successfully.`,
            data: product,
        };
        return response;
    }
    async getInventoriesRelatedToProduct(productId) {
        const inventories = await this.productService.getInventoriesByProductId(productId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Inventories realated to product with ID: '${productId}' retrived successfully.`,
            data: inventories,
        };
        return response;
    }
    async updateProductById(productId, editProductBodyDto) {
        const updatedProduct = await this.productService.updateProductById(productId, editProductBodyDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Product: '${productId}' was updated successfully.`,
            data: updatedProduct,
        };
        return response;
    }
    async addProductToCategoryById(productId, categoryId) {
        const product = await this.productService.addProductToCategoryById(productId, categoryId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Product: '${productId}' added to category: '${categoryId}' successfully.`,
            data: product,
        };
        return response;
    }
    async removeProductToCategoryById(productId, categoryId) {
        await this.productService.removeProductFromCategoryById(productId, categoryId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Product: '${productId}' removed from category: '${categoryId}' successfully.`,
        };
        return response;
    }
    async setDiscountOnProduct(productId, discountId) {
        const product = await this.productService.applyDiscountOnProductById(productId, discountId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Discount: '${discountId}' applied to product: '${productId}' successfully.`,
            data: product,
        };
        return response;
    }
    async removeDiscountFromProductById(productId) {
        const product = await this.productService.removeDiscountFromProductById(productId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Discont removed from product: '${productId}' successfully`,
            data: product,
        };
        return response;
    }
    async deleteProductById(productId) {
        await this.productService.deleteProductById(productId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Product: '${productId}' and it's relatable inventories were deleted successfully.`,
        };
        return response;
    }
    async restoreProductById(productId) {
        await this.productService.restoreProductById(productId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Product: '${productId}' and it's relatable inventories were restored successfully.`,
        };
        return response;
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Create a product` }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [productAndInventory_dto_1.CreateProductBodyDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "createNewProduct", null);
__decorate([
    (0, common_1.Post)(':id/createNewInventory'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Add a new inventory to a product by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, productAndInventory_dto_1.CreateInventoryBodyDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "addNewInventoryToProductById", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Get all products` }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queryParams_dto_1.GetAllProductsQueryParamsDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)('/deleted'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Get all deleted products` }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queryParams_dto_1.GetProductsQueryParamsDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllDeletedProducts", null);
__decorate([
    (0, common_1.Get)('/categories/:categoryId'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Get a product by it's id` }),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, queryParams_dto_1.GetProductsQueryParamsDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsByCategoryId", null);
__decorate([
    (0, common_1.Get)('/discounts/:discountId'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({
        summary: `Get all products belonging to a dicount by the discount's id`,
    }),
    __param(0, (0, common_1.Param)('discountId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, queryParams_dto_1.GetProductsQueryParamsDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsByDiscountId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Get a product by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Get)(':id/inventories'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Get all of a products inventories by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getInventoriesRelatedToProduct", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Update a product by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, editProductBody_dto_1.EditProductBodyDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateProductById", null);
__decorate([
    (0, common_1.Patch)(':id/addToCategory/:categoryId'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Add a product to a category by the category's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "addProductToCategoryById", null);
__decorate([
    (0, common_1.Patch)(':id/removeFromCategoy/:categoyId'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({
        summary: `Remove a product to a category by the category's id`,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "removeProductToCategoryById", null);
__decorate([
    (0, common_1.Patch)(':id/applyDiscount/:discountid'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Add a discount to a product by the discount's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('discountId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "setDiscountOnProduct", null);
__decorate([
    (0, common_1.Patch)(':id/removeDiscount/:discountid'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({
        summary: `Remove a discount to a product by the discount's id`,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "removeDiscountFromProductById", null);
__decorate([
    (0, common_1.Patch)(':id/delete'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Delete a product by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteProductById", null);
__decorate([
    (0, common_1.Patch)(':id/restore'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Restore a product by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "restoreProductById", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('products'),
    (0, swagger_1.ApiTags)('Products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map