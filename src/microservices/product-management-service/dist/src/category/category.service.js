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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CategoryService = class CategoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCategory(createCategoryDto) {
        try {
            const createdCategory = await this.prisma.category.create({
                data: { ...createCategoryDto },
            });
            return createdCategory;
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new common_1.ConflictException(`A category with the specified name: ${createCategoryDto.name} already exists`, { cause: e });
                }
                else {
                    throw new common_1.InternalServerErrorException('Something went wrong creating the new category, please try again later', { cause: e });
                }
            }
            else {
                throw new common_1.InternalServerErrorException('Something went wrong creating the new category, please try again later', { cause: e });
            }
        }
    }
    async getAllCategories(allCategoriesQueryParamsDto) {
        const show_deleted = allCategoriesQueryParamsDto.show_deleted ?? true;
        const page = allCategoriesQueryParamsDto.page ?? 1;
        const limit = allCategoriesQueryParamsDto.limit ?? 0;
        const skip = (page - 1) * limit;
        try {
            const categories = await this.prisma.category.findMany({
                where: show_deleted ? {} : { is_deleted: false },
                skip,
                take: limit === 0 ? undefined : limit,
            });
            const totalEntries = await this.prisma.category.count({
                where: show_deleted ? {} : { is_deleted: false },
            });
            return { categories, totalEntries };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Failed to retrieve categories. Please try again later.', { cause: e });
        }
    }
    async getCategoryById(categoryId) {
        try {
            const category = await this.prisma.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`The category with ID: '${categoryId}' does not exist`);
            }
            return category;
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException) {
                throw e;
            }
            throw new common_1.InternalServerErrorException(`Failed to retrieve category with ID: '${categoryId}'. Please try again later.`, { cause: e });
        }
    }
    async getAllDeletedCategories(allDeletedCategoriesQueryParamsDto) {
        const page = allDeletedCategoriesQueryParamsDto.page ?? 1;
        const limit = allDeletedCategoriesQueryParamsDto.limit ?? 0;
        const skip = (page - 1) * limit;
        try {
            const deletedCategories = await this.prisma.category.findMany({
                where: { is_deleted: true },
                skip,
                take: limit === 0 ? undefined : limit,
            });
            const totalEntries = await this.prisma.category.count({
                where: { is_deleted: true },
            });
            return { deletedCategories, totalEntries };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Failed to retrieve all deleted categories. Please try again later.', { cause: e });
        }
    }
    async updateCategoryById(categoryId, editCategoryDto) {
        try {
            const category = await this.prisma.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`The category with ID: '${categoryId}' did not exist`);
            }
            const updatedCategory = await this.prisma.category.update({
                where: { id: categoryId },
                data: { ...editCategoryDto, last_updated_at: new Date() },
            });
            return updatedCategory;
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new common_1.ConflictException(`A category with the specified name: ${editCategoryDto.name} already exists`, { cause: e });
                }
                else {
                    throw new common_1.InternalServerErrorException(`Something went wrong updating category: '${categoryId}' `, { cause: e });
                }
            }
            else {
                if (e instanceof common_1.NotFoundException) {
                    throw e;
                }
                throw new common_1.InternalServerErrorException(`Something went wrong updating category: '${categoryId}' `, { cause: e });
            }
        }
    }
    async deleteCategoryById(categoryId) {
        try {
            const category = await this.prisma.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`The category with ID: '${categoryId}' did not exist`);
            }
            if (category.is_deleted) {
                throw new common_1.ConflictException(`The category with ID: '${categoryId}' is already deleted`);
            }
            await this.prisma.category.update({
                where: { id: categoryId },
                data: {
                    is_deleted: true,
                    last_updated_at: new Date(),
                },
            });
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.ConflictException) {
                throw e;
            }
            throw new common_1.InternalServerErrorException(`Failed to delete categorie with id: '${categoryId}'. Please try again later.`, { cause: e });
        }
    }
    async restoreDeletedCategoryById(categoryId) {
        try {
            const category = await this.prisma.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`The category with ID: '${categoryId}' did not exist`);
            }
            if (!category.is_deleted) {
                throw new common_1.ConflictException(`The category with ID: '${categoryId}' is not deleted`);
            }
            await this.prisma.category.update({
                where: { id: categoryId },
                data: {
                    is_deleted: false,
                    last_updated_at: new Date(),
                },
            });
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.ConflictException) {
                throw e;
            }
            throw new common_1.InternalServerErrorException(`Failed to restore categorie with ID: '${categoryId}'. Please try again later.`, { cause: e });
        }
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryService);
//# sourceMappingURL=category.service.js.map