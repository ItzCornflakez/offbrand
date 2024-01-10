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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ProductService = class ProductService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async createNewProduct(newProductDto) {
        try {
            const { category_id: categoryId, ...rest } = newProductDto;
            const existingCategory = await this.prismaService.category.findUnique({
                where: { id: categoryId },
            });
            if (!existingCategory) {
                throw new common_1.NotFoundException(`Cannot create the new product because the category with ID: ${categoryId} does not exist.`);
            }
            const newProduct = await this.prismaService.product.create({
                data: {
                    ...rest,
                    inventories: {
                        create: newProductDto.inventories,
                    },
                    categories: {
                        create: {
                            category: {
                                connect: {
                                    id: categoryId,
                                },
                            },
                        },
                    },
                },
                include: {
                    inventories: true,
                    categories: true,
                },
            });
            return newProduct;
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new common_1.ConflictException('Cannot create the new product because two or more of the provided inventories share the same color. Each inventory must have a unique color for the product.', { cause: e });
                }
                else {
                    throw new common_1.InternalServerErrorException('Something went wrong creating the new product, please try again later.', { cause: e });
                }
            }
            else {
                if (e instanceof common_1.NotFoundException) {
                    throw e;
                }
                throw new common_1.InternalServerErrorException('Something went wrong creating the new product, please try again later.', { cause: e });
            }
        }
    }
    async addNewInvetoryToProductById(productId, createInventoryBodyDto) {
        try {
            const product = await this.prismaService.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the product with ID '${productId}' because it does not exist.`);
            }
            const updatedProduct = await this.prismaService.product.update({
                where: { id: productId },
                data: {
                    inventories: {
                        create: createInventoryBodyDto,
                    },
                },
            });
            return updatedProduct;
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new common_1.ConflictException('Cannot add the new inventory because this product already have an inventory with the provided color. Each inventory must have a unique color for the product.', { cause: e });
                }
                else {
                    throw new common_1.InternalServerErrorException('Something went wrong creating the new product, please try again later.', { cause: e });
                }
            }
            else {
                if (e instanceof common_1.NotFoundException) {
                    throw e;
                }
                throw new common_1.InternalServerErrorException('Something went wrong creating the new product, please try again later.', { cause: e });
            }
        }
    }
    async getAllProducts(getAllProductsQueryParamsDto) {
        const show_deleted = getAllProductsQueryParamsDto.show_deleted ?? true;
        const page = getAllProductsQueryParamsDto.page ?? 1;
        const limit = getAllProductsQueryParamsDto.limit ?? 0;
        const skip = (page - 1) * limit;
        try {
            const products = await this.prismaService.product.findMany({
                where: show_deleted ? {} : { is_deleted: false },
                skip,
                take: limit === 0 ? undefined : limit,
                include: {
                    inventories: true,
                    categories: {
                        select: { category_id: true },
                    },
                },
            });
            const totalEntries = await this.prismaService.product.count({
                where: show_deleted ? {} : { is_deleted: false },
            });
            return { products, totalEntries };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Something went wrong retriving the products, please try again later.', { cause: e });
        }
    }
    async getAllDeletedProducts(getProductsQueryParamsDto) {
        const page = getProductsQueryParamsDto.page ?? 1;
        const limit = getProductsQueryParamsDto.limit ?? 0;
        const skip = (page - 1) * limit;
        try {
            const products = await this.prismaService.product.findMany({
                where: { is_deleted: true },
                skip,
                take: limit === 0 ? undefined : limit,
                include: {
                    inventories: true,
                },
            });
            const totalEntries = await this.prismaService.product.count({
                where: { is_deleted: true },
            });
            return { products, totalEntries };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Something went wrong retriving the products, please try again later.', { cause: e });
        }
    }
    async getProductById(productId) {
        try {
            const product = await this.prismaService.product.findUnique({
                where: { id: productId },
                include: {
                    inventories: true,
                },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Cannot retrive the product with ID: '${productId}' because it does not exist.`);
            }
            return product;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(`Failed to retrieve product with ID: '${productId}'. Please try again later.`, { cause: e });
        }
    }
    async getProductsByCategoryId(categoryId, getProductsQueryParamsDto) {
        try {
            const category = await this.prismaService.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Cannot retrive products related to the category with ID: '${categoryId}' because it does not exist.`);
            }
            const show_deleted = getProductsQueryParamsDto.show_deleted ?? true;
            const page = getProductsQueryParamsDto.page ?? 1;
            const limit = getProductsQueryParamsDto.limit ?? 0;
            const skip = (page - 1) * limit;
            const products = await this.prismaService.product.findMany({
                where: show_deleted
                    ? { categories: { some: { category_id: categoryId } } }
                    : {
                        categories: { some: { category_id: categoryId } },
                        is_deleted: false,
                    },
                skip,
                take: limit === 0 ? undefined : limit,
                include: {
                    inventories: true,
                },
            });
            const totalEntries = await this.prismaService.product.count({
                where: show_deleted
                    ? { categories: { some: { category_id: categoryId } } }
                    : {
                        categories: { some: { category_id: categoryId } },
                        is_deleted: false,
                    },
            });
            return { products, totalEntries };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(`Failed to retrieve products related to the category with ID: '${categoryId}'. Please try again later.`, { cause: e });
        }
    }
    async getProductsByDiscountId(discountId, getProductsQueryParamsDto) {
        try {
            const discount = await this.prismaService.discount.findUnique({
                where: { id: discountId },
            });
            if (!discount) {
                throw new common_1.NotFoundException(`Cannot retrive products related to the discount with ID: '${discountId}' because it does not exist.`);
            }
            const show_deleted = getProductsQueryParamsDto.show_deleted ?? true;
            const page = getProductsQueryParamsDto.page ?? 1;
            const limit = getProductsQueryParamsDto.limit ?? 0;
            const skip = (page - 1) * limit;
            const products = await this.prismaService.product.findMany({
                where: show_deleted
                    ? { discount_id: discountId }
                    : { discount_id: discountId, is_deleted: false },
                skip,
                take: limit === 0 ? undefined : limit,
                include: {
                    inventories: true,
                },
            });
            const totalEntries = await this.prismaService.product.count({
                where: show_deleted
                    ? { discount_id: discountId }
                    : { discount_id: discountId, is_deleted: false },
            });
            return { products, totalEntries };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(`Failed to retrieve products related to the discount with ID: '${discountId}'. Please try again later.`, { cause: e });
        }
    }
    async getInventoriesByProductId(productId) {
        try {
            const product = await this.prismaService.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Cannot retrive inventories related to the product with ID: '${productId}' because it does not exist.`);
            }
            const inventories = await this.prismaService.product.findMany({
                where: { id: productId },
                select: {
                    inventories: true,
                },
            });
            return inventories;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(`Failed to retrieve inventories related to the product with ID: '${productId}'. Please try again later.`, { cause: e });
        }
    }
    async updateProductById(productId, editProductBodyDto) {
        try {
            const product = await this.prismaService.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the product with ID: '${productId}' because it does not exist.`);
            }
            if (product.is_deleted) {
                throw new common_1.ConflictException(`Cannot perform the operation on the product with ID: '${productId}' because it is marked as deleted.`);
            }
            const updatedProduct = await this.prismaService.$transaction([
                this.prismaService.product.update({
                    where: { id: productId },
                    data: { ...editProductBodyDto, last_updated_at: new Date() },
                    include: {
                        inventories: true,
                    },
                }),
            ]);
            return updatedProduct;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(`Failed to update the product with ID: '${productId}'. Please try again later.`, { cause: e });
        }
    }
    async addProductToCategoryById(productId, categoryId) {
        try {
            const product = await this.prismaService.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the product with ID: '${productId}' because it does not exist.`);
            }
            if (product.is_deleted) {
                throw new common_1.ConflictException(`Cannot perform the operation on the product with ID: '${productId}' because it is marked as deleted.`);
            }
            const category = await this.prismaService.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the product with ID: '${productId}' because the catecory with ID: '${categoryId}' does not exist.`);
            }
            if (category.is_deleted) {
                throw new common_1.ConflictException(`Cannot perform the operation on the product with ID: '${productId}' because the category with ID: '${categoryId}' is marked as deleted.`);
            }
            const updatedProduct = await this.prismaService.$transaction([
                this.prismaService.product.update({
                    where: { id: productId },
                    data: {
                        categories: {
                            create: {
                                category: {
                                    connect: {
                                        id: categoryId,
                                    },
                                },
                            },
                        },
                    },
                    include: {
                        inventories: true,
                    },
                }),
            ]);
            return updatedProduct;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(`Failed to add the product with ID: '${productId}' to the category with ID: '${categoryId}'. Please try again later.`, { cause: e });
        }
    }
    async removeProductFromCategoryById(productId, categoryId) {
        try {
            const product = await this.prismaService.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the product with ID: '${productId}' because it does not exist.`);
            }
            if (product.is_deleted) {
                throw new common_1.ConflictException(`Cannot perform the operation on the product with ID: '${productId}' because it is marked as deleted.`);
            }
            const category = await this.prismaService.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the product with ID: '${productId}' because the catecory with ID: '${categoryId}' does not exist.`);
            }
            if (category.is_deleted) {
                throw new common_1.ConflictException(`Cannot perform the operation on the product with ID: '${productId}' because the category with ID: '${categoryId}' is marked as deleted.`);
            }
            const NrOfCategoriesLeft = await this.prismaService.productCategory.count({
                where: {
                    product_id: productId,
                },
            });
            if (NrOfCategoriesLeft === 1) {
                throw new common_1.ConflictException(`Cannot remove the product with ID '${productId}' from the category with ID: '${category}', because it is the last category that this product belongs to.`);
            }
            await this.prismaService.$transaction([
                this.prismaService.productCategory.delete({
                    where: {
                        product_id_category_id: {
                            product_id: productId,
                            category_id: categoryId,
                        },
                    },
                }),
            ]);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(`Failed to remove the product with ID: '${productId}' from the category with ID: '${categoryId}'. Please try again later.`, { cause: e });
        }
    }
    async applyDiscountOnProductById(productId, discountId) {
        try {
            const product = await this.prismaService.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the product with ID: '${productId}' because it does not exist.`);
            }
            if (product.is_deleted) {
                throw new common_1.ConflictException(`Cannot perform the operation on the product with ID: '${productId}' because it is marked as deleted.`);
            }
            const discount = await this.prismaService.discount.findUnique({
                where: { id: discountId },
            });
            if (!discount) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the product with ID: '${productId}' because the discount with ID: ${discountId} does not exist.`);
            }
            if (discount.is_deleted) {
                throw new common_1.ConflictException(`Cannot perform the operation on the product with ID: '${productId}' because the discount with ID: ${discountId} is marked as deleted.`);
            }
            const updatedProduct = await this.prismaService.$transaction([
                this.prismaService.product.update({
                    where: { id: productId },
                    data: { discount_id: discountId, last_updated_at: new Date() },
                    include: { inventories: true },
                }),
            ]);
            return updatedProduct;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(`Failed to apply discount with ID: '${discountId}' to the product with ID: '${productId}'. Please try again later.`, { cause: e });
        }
    }
    async removeDiscountFromProductById(productId) {
        try {
            const product = await this.prismaService.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the product with ID: '${productId}' because it does not exist.`);
            }
            if (product.is_deleted) {
                throw new common_1.ConflictException(`Cannot perform the operation on the product with ID: '${productId}' because it is marked as deleted.`);
            }
            if (product.discount_id === null || product.discount_id === undefined) {
                throw new common_1.ConflictException(`Cannot perform the operation on the product with ID: '${productId}' because no discount is currently applied to the product.`);
            }
            const updatedProduct = await this.prismaService.$transaction([
                this.prismaService.product.update({
                    where: { id: productId },
                    data: { discount_id: null, last_updated_at: new Date() },
                }),
            ]);
            return updatedProduct;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(`Failed to remove the applied discount from the product with ID: '${productId}'. Please try again later.`, { cause: e });
        }
    }
    async deleteProductById(productId) {
        try {
            const product = await this.prismaService.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the product with ID: '${productId}' because it does not exist.`);
            }
            if (product.is_deleted) {
                throw new common_1.ConflictException(`Cannot perform the operation on the inventory with ID: '${productId}' because it is already marked as deleted.`);
            }
            await this.prismaService.$transaction([
                this.prismaService.product.update({
                    where: { id: productId },
                    data: { is_deleted: true, last_updated_at: new Date() },
                }),
                this.prismaService.inventory.updateMany({
                    where: { product_id: productId, is_deleted: false },
                    data: { is_deleted: true, last_updated_at: new Date() },
                }),
            ]);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(`Failed to delete the product with ID: '${productId}'. Please try again later.`, { cause: e });
        }
    }
    async restoreProductById(productId) {
        try {
            const product = await this.prismaService.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the product with ID: '${productId}' because it does not exist.`);
            }
            if (product.is_deleted) {
                throw new common_1.ConflictException(`Cannot perform the operation on the inventory with ID: '${productId}' because it is already marked as deleted.`);
            }
            await this.prismaService.$transaction([
                this.prismaService.product.update({
                    where: { id: productId },
                    data: { is_deleted: false, last_updated_at: new Date() },
                }),
                this.prismaService.inventory.updateMany({
                    where: { product_id: productId },
                    data: { is_deleted: false, last_updated_at: new Date() },
                }),
            ]);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(`Failed to restore the product with ID: '${productId}'. Please try again later.`, { cause: e });
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=product.service.js.map