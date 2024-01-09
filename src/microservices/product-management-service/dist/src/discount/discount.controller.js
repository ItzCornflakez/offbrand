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
exports.DiscountController = void 0;
const common_1 = require("@nestjs/common");
const discount_service_1 = require("./discount.service");
const swagger_1 = require("@nestjs/swagger");
const createDiscountBody_dto_1 = require("./dto/createDiscountBody.dto");
const editDiscountBody_dto_1 = require("./dto/editDiscountBody.dto");
const queryParams_dto_1 = require("./dto/queryParams.dto");
let DiscountController = class DiscountController {
    constructor(discountService) {
        this.discountService = discountService;
    }
    async createNewDiscount(newDiscountDto) {
        const newDiscount = await this.discountService.createNewDiscount(newDiscountDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.CREATED,
            statusText: 'Disscount created successfully.',
            data: newDiscount,
        };
        return response;
    }
    async getAllDiscounts(getAllDiscountsQueryParamsDto) {
        const { discounts, totalEntries } = await this.discountService.getAllDiscounts(getAllDiscountsQueryParamsDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: 'Discount(s) retrived successfully.',
            data: {
                discounts: discounts,
                totalEntries: totalEntries,
            },
        };
        return response;
    }
    async getAllActiveDiscounts(getDiscountQueryParamsDto) {
        const { activeDiscounts, totalEntries } = await this.discountService.getAllActiveDiscounts(getDiscountQueryParamsDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: 'Disscount(s) retrived successfully.',
            data: {
                discounts: activeDiscounts,
                totalEntries: totalEntries,
            },
        };
        return response;
    }
    async getAllInactiveDiscounts(getDiscountQueryParamsDto) {
        const { inactiveDiscounts, totalEntries } = await this.discountService.getAllInactiveDiscounts(getDiscountQueryParamsDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: 'Disscount(s) retrived successfully.',
            data: {
                discounts: inactiveDiscounts,
                totalEntries: totalEntries,
            },
        };
        return response;
    }
    async getAllDeletedDiscounts(getDiscountQueryParamsDto) {
        const { deletedDisounts, totalEntries } = await this.discountService.getAllDeletedDiscounts(getDiscountQueryParamsDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: 'Disscount(s) retrived successfully.',
            data: {
                discounts: deletedDisounts,
                totalEntries: totalEntries,
            },
        };
        return response;
    }
    async getDiscountById(discountId) {
        const discount = await this.discountService.getDiscountById(discountId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: 'Disscount retrived successfully.',
            data: discount,
        };
        return response;
    }
    async updateDiscountById(discountId, editDiscountDto) {
        const updatedDiscount = await this.discountService.updateDiscountById(discountId, editDiscountDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Discount: '${discountId}' was updated successfully.`,
            data: updatedDiscount,
        };
        return response;
    }
    async deleteDiscountById(discountId) {
        await this.discountService.deleteDiscountById(discountId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Discount: '${discountId}' was deleted successfully.`,
        };
        return response;
    }
    async restoreDiscountById(discountId) {
        await this.discountService.restoreDiscountById(discountId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Discount: '${discountId}' was restored successfully.`,
        };
        return response;
    }
    async activateDiscountById(discountId) {
        const activatedDiscount = await this.discountService.activateDiscountById(discountId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Discount '${discountId}' was activated successfully.`,
            data: activatedDiscount,
        };
        return response;
    }
    async inactivateDiscountById(discountId) {
        const inactivatedDiscount = await this.discountService.inactivateDiscountById(discountId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Discount: '${discountId}' was inactivated successfully.`,
            data: inactivatedDiscount,
        };
        return response;
    }
};
exports.DiscountController = DiscountController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a discount' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createDiscountBody_dto_1.CreateNewDiscountDto]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "createNewDiscount", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all discounts' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queryParams_dto_1.GetAllDiscountsQueryParamsDto]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "getAllDiscounts", null);
__decorate([
    (0, common_1.Get)('/active'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active discounts' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queryParams_dto_1.GetDiscountsQueryParamsDto]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "getAllActiveDiscounts", null);
__decorate([
    (0, common_1.Get)('/inactive'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all inactive discounts' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queryParams_dto_1.GetDiscountsQueryParamsDto]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "getAllInactiveDiscounts", null);
__decorate([
    (0, common_1.Get)('/deleted'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all deleted discounts' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queryParams_dto_1.GetDiscountsQueryParamsDto]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "getAllDeletedDiscounts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Get a discount by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "getDiscountById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Update a discounts by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, editDiscountBody_dto_1.EditDiscountDto]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "updateDiscountById", null);
__decorate([
    (0, common_1.Patch)(':id/delete'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Delete a discount by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "deleteDiscountById", null);
__decorate([
    (0, common_1.Patch)(':id/restore'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Restore a discount by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "restoreDiscountById", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Activate a discount by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "activateDiscountById", null);
__decorate([
    (0, common_1.Patch)(':id/inactivate'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Inactivate a discount by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DiscountController.prototype, "inactivateDiscountById", null);
exports.DiscountController = DiscountController = __decorate([
    (0, common_1.Controller)('discounts'),
    (0, swagger_1.ApiTags)('Discount'),
    __metadata("design:paramtypes", [discount_service_1.DiscountService])
], DiscountController);
//# sourceMappingURL=discount.controller.js.map