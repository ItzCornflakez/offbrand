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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let InventoryService = class InventoryService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getAllInventories(getAllInventoriesQueryParamsDto) {
        const show_deleted = getAllInventoriesQueryParamsDto.show_deleted ?? true;
        const page = getAllInventoriesQueryParamsDto.page ?? 1;
        const limit = getAllInventoriesQueryParamsDto.limit ?? 0;
        const skip = (page - 1) * limit;
        try {
            const inventories = this.prismaService.inventory.findMany({
                where: show_deleted ? {} : { is_deleted: false },
                skip,
                take: limit === 0 ? undefined : limit,
                select: {
                    id: true,
                    quantity: true,
                    color: true,
                    is_deleted: true,
                    created_at: true,
                    last_updated_at: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            const totalEntries = await this.prismaService.inventory.count({
                where: show_deleted ? {} : { is_deleted: false },
            });
            return { inventories, totalEntries };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Something went wrong retriving the inventories, please try again later.', { cause: e });
        }
    }
    async getInventoryById(inventoryId) {
        try {
            const inventory = await this.prismaService.inventory.findUnique({
                where: { id: inventoryId },
                select: {
                    id: true,
                    quantity: true,
                    color: true,
                    is_deleted: true,
                    created_at: true,
                    last_updated_at: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            if (!inventory) {
                throw new common_1.NotFoundException(`Cannot retrive the inventory with ID '${inventoryId}' because it does not exist.`);
            }
            return inventory;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(`Failed to retrieve inventory with ID: '${inventoryId}'. Please try again later.`, { cause: e });
        }
    }
    async getAllDeletedInventories(getInventoriesQueryParamsDto) {
        const page = getInventoriesQueryParamsDto.page ?? 1;
        const limit = getInventoriesQueryParamsDto.limit ?? 0;
        const skip = (page - 1) * limit;
        try {
            const inventories = await this.prismaService.inventory.findMany({
                where: { is_deleted: true },
                skip,
                take: limit === 0 ? undefined : limit,
                select: {
                    id: true,
                    quantity: true,
                    color: true,
                    is_deleted: true,
                    created_at: true,
                    last_updated_at: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            const totalEntries = await this.prismaService.inventory.count({
                where: { is_deleted: true },
            });
            return { inventories, totalEntries };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Something went wrong retriving all of the deleted inventories, please try again later.', { cause: e });
        }
    }
    async updateInventoryById(inventoryId, editInventoryBodyDto) {
        try {
            const inventory = await this.prismaService.inventory.findUnique({
                where: { id: inventoryId },
            });
            if (!inventory) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the inventory with ID '${inventoryId}' because it does not exist.`);
            }
            if (inventory.is_deleted) {
                throw new common_1.ConflictException(`Cannot perform the operation on the inventory with ID '${inventoryId}' because it is marked as deleted.`);
            }
            const updatedInventory = await this.prismaService.$transaction([
                this.prismaService.inventory.update({
                    where: { id: inventoryId },
                    data: { ...editInventoryBodyDto, last_updated_at: new Date() },
                    select: {
                        id: true,
                        quantity: true,
                        color: true,
                        is_deleted: true,
                        created_at: true,
                        last_updated_at: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                }),
            ]);
            return updatedInventory;
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new common_1.ConflictException(`Cannot perform the operation on the inventory with ID '${inventoryId}' because the same color is already associated with this product.`, { cause: e });
                }
                else {
                    throw new common_1.InternalServerErrorException(`Something went wrong updating the inventory with ID '${inventoryId}', please try again later.`, { cause: e });
                }
            }
            else {
                throw new common_1.InternalServerErrorException(`Something went wrong updating the inventory with ID '${inventoryId}', please try again later.`, { cause: e });
            }
        }
    }
    async deleteInventoryById(inventoryId) {
        try {
            const inventory = await this.prismaService.inventory.findUnique({
                where: { id: inventoryId },
            });
            if (!inventory) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the inventory with ID '${inventoryId}' because it does not exist.`);
            }
            if (inventory.is_deleted) {
                throw new common_1.ConflictException(`Cannot perform the operation on the inventory with ID '${inventoryId}' because it is already marked as deleted.`);
            }
            const nonDeletedInventoriesCount = await this.prismaService.inventory.count({
                where: {
                    product_id: inventory.product_id,
                    is_deleted: false,
                },
            });
            if (nonDeletedInventoriesCount === 1) {
                throw new common_1.ConflictException(`Cannot delete inventory with ID '${inventoryId}' because it is the last non-deleted inventory for product with ID ${inventory.product_id}.`);
            }
            await this.prismaService.$transaction([
                this.prismaService.inventory.update({
                    where: { id: inventoryId },
                    data: { is_deleted: true, last_updated_at: new Date() },
                }),
            ]);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('', { cause: e });
        }
    }
    async restoreInventoryById(inventoryId) {
        try {
            const inventory = await this.prismaService.inventory.findUnique({
                where: { id: inventoryId },
            });
            if (!inventory) {
                throw new common_1.NotFoundException(`Cannot perform the operation on the inventory with ID '${inventoryId}' because it does not exist.`);
            }
            if (!inventory.is_deleted) {
                throw new common_1.ConflictException(`Cannot perform the operation on the inventory with ID '${inventoryId}' because it is not marked as deleted.`);
            }
            const product = await this.prismaService.product.findUnique({
                where: { id: inventory.product_id },
            });
            if (product.is_deleted) {
                throw new common_1.ConflictException(`The product with id: '${product.id}' is deleted! Restore it first.`);
            }
            await this.prismaService.$transaction([
                this.prismaService.inventory.update({
                    where: { id: inventoryId },
                    data: { is_deleted: false, last_updated_at: new Date() },
                }),
            ]);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('', { cause: e });
        }
    }
    async reduceInventoryById(inventoryId, reduceQuantityBodyDto) {
        const inventory = await this.prismaService.inventory.findUnique({
            where: { id: inventoryId },
        });
        if (!inventory) {
            throw new common_1.NotFoundException(`Cannot perform the operation on the inventory with ID '${inventoryId}' because it does not exist.`);
        }
        if (inventory.is_deleted) {
            throw new common_1.ConflictException(`Cannot perform the operation on the inventory with ID '${inventoryId}' because it is marked as deleted.`);
        }
        const newInventoryQuantity = inventory.quantity - reduceQuantityBodyDto.quantity;
        if (newInventoryQuantity < 0) {
            throw new common_1.ConflictException(`Cannot perform the operation on the inventory with ID '${inventoryId}' due to insufficient quantity. `);
        }
        const reducedInventory = await this.prismaService.$transaction([
            this.prismaService.inventory.update({
                where: { id: inventoryId },
                data: { quantity: newInventoryQuantity, last_updated_at: new Date() },
            }),
        ]);
        return reducedInventory;
    }
    async increaseInventoryById(inventoryId, increaseQuantityBodyDto) {
        const inventory = await this.prismaService.inventory.findUnique({
            where: { id: inventoryId },
        });
        if (!inventory) {
            throw new common_1.NotFoundException(`Cannot perform the operation on the inventory with ID '${inventoryId}' because it does not exist.`);
        }
        if (inventory.is_deleted) {
            throw new common_1.ConflictException(`Cannot perform the operation on the inventory with ID '${inventoryId}' because it is marked as deleted.`);
        }
        const newInventoryQuantity = inventory.quantity + increaseQuantityBodyDto.quantity;
        const increasedInventory = await this.prismaService.$transaction([
            this.prismaService.inventory.update({
                where: { id: inventoryId },
                data: { quantity: newInventoryQuantity, last_updated_at: new Date() },
            }),
        ]);
        return increasedInventory;
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map