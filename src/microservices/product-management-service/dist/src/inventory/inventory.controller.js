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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const swagger_1 = require("@nestjs/swagger");
const queryParams_dto_1 = require("./dto/queryParams.dto");
const editInventoryBody_dto_1 = require("./dto/editInventoryBody.dto");
const reduceQuantityBody_dto_1 = require("./dto/reduceQuantityBody.dto");
const increaseQuantityBody_dto_1 = require("./dto/increaseQuantityBody.dto");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async getAllInventories(getAllInventoriesQueryParamsDto) {
        const { inventories, totalEntries } = await this.inventoryService.getAllInventories(getAllInventoriesQueryParamsDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: 'Inventories retrived successfully.',
            data: {
                inventories: inventories,
                totalEntries: totalEntries,
            },
        };
        return response;
    }
    async getInventoryById(inventoryId) {
        const inventory = await this.inventoryService.getInventoryById(inventoryId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Inventory with ID: '${inventoryId}' was retrived successfully.`,
            data: inventory,
        };
        return response;
    }
    async getAllDeletedInventories(getInventoriesQueryParamsDto) {
        const { inventories, totalEntries } = await this.inventoryService.getAllDeletedInventories(getInventoriesQueryParamsDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: 'Inventories retrived successfully.',
            data: {
                inventories: inventories,
                totalEntries: totalEntries,
            },
        };
        return response;
    }
    async updateInventoryById(inventoryId, editInventoryBodyDto) {
        const updatedInventory = await this.inventoryService.updateInventoryById(inventoryId, editInventoryBodyDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Inventory with ID: '${inventoryId}' was updated successfully.`,
            data: updatedInventory,
        };
        return response;
    }
    async deleteInventoryById(inventoryId) {
        await this.inventoryService.deleteInventoryById(inventoryId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Inventory with ID: '${inventoryId}' was deleted successfully.`,
        };
        return response;
    }
    async restoreInventoryById(inventoryId) {
        await this.inventoryService.restoreInventoryById(inventoryId);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Inventory with ID: '${inventoryId}' was restored successfully.`,
        };
        return response;
    }
    async reduceInventoryQuantityById(inventoryId, reduceQuantityBodyDto) {
        const reducedInventory = await this.inventoryService.reduceInventoryById(inventoryId, reduceQuantityBodyDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Inventory with ID: '${inventoryId}' quantity reduced successfully.`,
            data: reducedInventory,
        };
        return response;
    }
    async increaseInventoryQuantityById(inventoryId, increaseQuantityBodyDto) {
        const increasedInventory = await this.inventoryService.increaseInventoryById(inventoryId, increaseQuantityBodyDto);
        const response = {
            status: 'Success',
            statusCode: common_1.HttpStatus.OK,
            statusText: `Inventory with ID: '${inventoryId}' quantity reduced successfully.`,
            data: increasedInventory,
        };
        return response;
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Get all inventories` }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queryParams_dto_1.GetAllInventoriesQueryParamsDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getAllInventories", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Get a inventory by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getInventoryById", null);
__decorate([
    (0, common_1.Get)('/deleted'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Get all deleted inventories` }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queryParams_dto_1.GetInventoriesQueryParamsDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getAllDeletedInventories", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Update a inventory by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, editInventoryBody_dto_1.EditInventoryBodyDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "updateInventoryById", null);
__decorate([
    (0, common_1.Patch)(':id/delete'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Delete a inventory by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "deleteInventoryById", null);
__decorate([
    (0, common_1.Patch)('id/restore'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Restore a inventory by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "restoreInventoryById", null);
__decorate([
    (0, common_1.Patch)(':id/reduce'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Reduce the quantity of a inventory by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, reduceQuantityBody_dto_1.ReduceQuantityBodyDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "reduceInventoryQuantityById", null);
__decorate([
    (0, common_1.Patch)(':id/increase'),
    (0, common_1.Version)('1'),
    (0, swagger_1.ApiOperation)({ summary: `Increase the quantity of a inventory by it's id` }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, increaseQuantityBody_dto_1.IncreaseQuantityBodyDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "increaseInventoryQuantityById", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventories'),
    (0, swagger_1.ApiTags)('Inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map