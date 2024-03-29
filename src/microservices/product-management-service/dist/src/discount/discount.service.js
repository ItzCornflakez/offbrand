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
exports.DiscountService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DiscountService = class DiscountService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async createNewDiscount(newDiscountDto) {
        try {
            const newDiscount = this.prismaService.discount.create({
                data: { ...newDiscountDto },
            });
            return newDiscount;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Something went wrong creating the new discount, please try again later.', { cause: e });
        }
    }
    async getAllDiscounts(getAllDiscountsQueryParamsDto) {
        const show_deleted = getAllDiscountsQueryParamsDto.show_deleted ?? true;
        const page = getAllDiscountsQueryParamsDto.page ?? 1;
        const limit = getAllDiscountsQueryParamsDto.limit ?? 0;
        const skip = (page - 1) * limit;
        try {
            const discounts = await this.prismaService.discount.findMany({
                where: show_deleted ? {} : { is_deleted: false },
                skip,
                take: limit === 0 ? undefined : limit,
            });
            const totalEntries = await this.prismaService.discount.count({
                where: show_deleted ? {} : { is_deleted: false },
            });
            return { discounts, totalEntries };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Something went wrong retriving the discounts, please try again later.', { cause: e });
        }
    }
    async getDiscountById(discountId) {
        try {
            const discount = await this.prismaService.discount.findUnique({
                where: { id: discountId },
            });
            if (!discount) {
                throw new common_1.NotFoundException(`Cannot retrive discount with ID:'${discountId}' because it does not exist.`);
            }
            return discount;
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException) {
                throw e;
            }
            throw new common_1.InternalServerErrorException(`Failed to retrieve discount with id: '${discountId}'. Please try again later.`, { cause: e });
        }
    }
    async getAllActiveDiscounts(getDiscountQueryParamsDto) {
        const page = getDiscountQueryParamsDto.page ?? 1;
        const limit = getDiscountQueryParamsDto.limit ?? 0;
        const skip = (page - 1) * limit;
        try {
            const activeDiscounts = await this.prismaService.discount.findMany({
                where: { is_active: true },
                skip,
                take: limit === 0 ? undefined : limit,
            });
            const totalEntries = await this.prismaService.discount.count({
                where: { is_active: true },
            });
            return { activeDiscounts, totalEntries };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Something went wrong retriving all of the active discounts, please try again later.', { cause: e });
        }
    }
    async getAllInactiveDiscounts(getDiscountQueryParamsDto) {
        const page = getDiscountQueryParamsDto.page ?? 1;
        const limit = getDiscountQueryParamsDto.limit ?? 0;
        const skip = (page - 1) * limit;
        try {
            const inactiveDiscounts = await this.prismaService.discount.findMany({
                where: { is_active: false },
                skip,
                take: limit === 0 ? undefined : limit,
            });
            const totalEntries = await this.prismaService.discount.count({
                where: { is_active: false },
            });
            return { inactiveDiscounts, totalEntries };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Something went wrong retriving all of the inactive discounts, please try again later.', { cause: e });
        }
    }
    async getAllDeletedDiscounts(getDiscountQueryParamsDto) {
        const page = getDiscountQueryParamsDto.page ?? 1;
        const limit = getDiscountQueryParamsDto.limit ?? 0;
        const skip = (page - 1) * limit;
        try {
            const deletedDisounts = await this.prismaService.discount.findMany({
                where: { is_deleted: true },
                skip,
                take: limit === 0 ? undefined : limit,
            });
            const totalEntries = await this.prismaService.discount.count({
                where: { is_deleted: true },
            });
            return { deletedDisounts, totalEntries };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Something went wrong retriving all of the deleted discounts, please try again later.', { cause: e });
        }
    }
    async updateDiscountById(discountId, editDiscountDto) {
        try {
            const discount = await this.prismaService.discount.findUnique({
                where: { id: discountId },
            });
            if (!discount) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the discount with ID '${discountId}' because it does not exist.`);
            }
            const updatedDiscount = await this.prismaService.discount.update({
                where: { id: discountId },
                data: { ...editDiscountDto, last_updated_at: new Date() },
            });
            return updatedDiscount;
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException) {
                throw e;
            }
            throw new common_1.InternalServerErrorException(`Something went wrong updating discount: '${discountId}', please try again later. `, { cause: e });
        }
    }
    async deleteDiscountById(discountId) {
        try {
            const discount = await this.prismaService.discount.findUnique({
                where: { id: discountId },
            });
            if (!discount) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the discount with ID '${discountId}' because it does not exist.`);
            }
            if (discount.is_deleted) {
                throw new common_1.ConflictException(`Cannot perform the operation on the discount with ID '${discountId}' because it is already marked as deleted.`);
            }
            await this.prismaService.discount.update({
                where: { id: discountId },
                data: { is_deleted: true, last_updated_at: new Date() },
            });
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.ConflictException) {
                throw e;
            }
            throw new common_1.InternalServerErrorException(`Something went wrong deleting discount: '${discountId}', please try again later. `, { cause: e });
        }
    }
    async restoreDiscountById(discountId) {
        try {
            const discount = await this.prismaService.discount.findUnique({
                where: { id: discountId },
            });
            if (!discount) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the discount with ID: '${discountId}' because it does not exist.`);
            }
            if (!discount.is_deleted) {
                throw new common_1.ConflictException(`Cannot perform the operation on the discount with ID: '${discountId}' because it is not marked as deleted.`);
            }
            await this.prismaService.discount.update({
                where: { id: discountId },
                data: { is_deleted: false, last_updated_at: new Date() },
            });
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.ConflictException) {
                throw e;
            }
            throw new common_1.InternalServerErrorException(`Something went wrong restoring discount: '${discountId}', please try again later.`, { cause: e });
        }
    }
    async activateDiscountById(discountId) {
        try {
            const discount = await this.prismaService.discount.findUnique({
                where: { id: discountId },
            });
            if (!discount) {
                throw new common_1.NotFoundException(`Cannot activate discount with ID: '${discountId}' because it does not exist.`);
            }
            if (discount.is_active) {
                throw new common_1.ConflictException(`Cannot activate discount with ID: '${discountId}' because it is already active.`);
            }
            const activatedDiscount = await this.prismaService.discount.update({
                where: { id: discountId },
                data: { is_active: true, last_updated_at: new Date() },
            });
            return activatedDiscount;
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.ConflictException) {
                throw e;
            }
            throw new common_1.InternalServerErrorException(`Something went wrong activating discount: '${discountId}', please try again later.`, { cause: e });
        }
    }
    async inactivateDiscountById(discountId) {
        try {
            const discount = await this.prismaService.discount.findUnique({
                where: { id: discountId },
            });
            if (!discount) {
                throw new common_1.NotFoundException(`Cannot inactivate discount with ID: '${discountId}' because it does not exist.`);
            }
            if (!discount.is_active) {
                throw new common_1.ConflictException(`Cannot activate discount with ID: '${discountId}' because it is already inactive.`);
            }
            const inactivatedDiscount = await this.prismaService.discount.update({
                where: { id: discountId },
                data: { is_active: false, last_updated_at: new Date() },
            });
            return inactivatedDiscount;
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException || e instanceof common_1.ConflictException) {
                throw e;
            }
            throw new common_1.InternalServerErrorException(`Something went wrong inactivating discount: '${discountId}', please try again later.`, { cause: e });
        }
    }
};
exports.DiscountService = DiscountService;
exports.DiscountService = DiscountService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiscountService);
//# sourceMappingURL=discount.service.js.map