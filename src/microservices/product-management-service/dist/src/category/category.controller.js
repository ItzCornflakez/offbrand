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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category.service");
const createCategoryBody_dto_1 = require("./dto/createCategoryBody.dto");
const editCategoryBody_dto_1 = require("./dto/editCategoryBody.dto");
const swagger_1 = require("@nestjs/swagger");
const queryParams_dto_1 = require("./dto/queryParams.dto");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async createCategory(createCategoryDto) {
        const createdCategory = await this.categoryService.createCategory(createCategoryDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.CREATED,
            statusText: 'Category created successfully.',
            data: createdCategory,
        };
        return response;
    }
    async getAllCategories(allCategoriesQueryParamsDto) {
        const { categories, totalEntries } = await this.categoryService.getAllCategories(allCategoriesQueryParamsDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: 'All categories retrived successfully.',
            data: {
                categories: categories,
                totalEntries: totalEntries,
            },
        };
        return response;
    }
    async getAllDeletedCategories(allDeletedCategoriesQueryParamsDto) {
        const { deletedCategories, totalEntries } = await this.categoryService.getAllDeletedCategories(allDeletedCategoriesQueryParamsDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: 'All deleted categories retrived successfully.',
            data: {
                categories: deletedCategories,
                totalEntries: totalEntries,
            },
        };
        return response;
    }
    async getCategoryById(categoryId) {
        const category = await this.categoryService.getCategoryById(categoryId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Category with id: '${categoryId}' retrived successfully.`,
            data: category,
        };
        return response;
    }
    async updateCategoryById(categoryId, editCategoryDto) {
        const updatedCategory = await this.categoryService.updateCategoryById(categoryId, editCategoryDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Category '${categoryId}' was updated successfully.`,
            data: updatedCategory,
        };
        return response;
    }
    async deleteCategoryById(categoryId) {
        await this.categoryService.deleteCategoryById(categoryId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Category '${categoryId}' was deleted successfully.`,
        };
        return response;
    }
    async restoreDeletedCategoryById(categoryId) {
        await this.categoryService.restoreDeletedCategoryById(categoryId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Category '${categoryId}' was restored successfully.`,
        };
        return response;
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a category' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createCategoryBody_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queryParams_dto_1.GetAllCategoriesQueryParamsDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)('/deleted'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all of the deleted categories' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queryParams_dto_1.GetAllDeletedCategoriesQueryParamsDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getAllDeletedCategories", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Get a category by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategoryById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a category' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, editCategoryBody_dto_1.EditCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "updateCategoryById", null);
__decorate([
    (0, common_1.Patch)(':id/delete'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a category' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteCategoryById", null);
__decorate([
    (0, common_1.Patch)(':id/restore'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: 'Restore a deleted category' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "restoreDeletedCategoryById", null);
exports.CategoryController = CategoryController = __decorate([
    (0, common_1.Controller)('categories'),
    (0, swagger_1.ApiTags)('Category'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map