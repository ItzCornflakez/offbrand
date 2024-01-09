import { PrismaService } from '../prisma/prisma.service';
import { GetAllInventoriesQueryParamsDto, GetInventoriesQueryParamsDto } from './dto/queryParams.dto';
import { EditInventoryBodyDto } from './dto/editInventoryBody.dto';
import { ReduceQuantityBodyDto } from './dto/reduceQuantityBody.dto';
import { IncreaseQuantityBodyDto } from './dto/increaseQuantityBody.dto';
export declare class InventoryService {
    private prismaService;
    constructor(prismaService: PrismaService);
    getAllInventories(getAllInventoriesQueryParamsDto: GetAllInventoriesQueryParamsDto): Promise<{
        inventories: any;
        totalEntries: any;
    }>;
    getInventoryById(inventoryId: number): Promise<any>;
    getAllDeletedInventories(getInventoriesQueryParamsDto: GetInventoriesQueryParamsDto): Promise<{
        inventories: any;
        totalEntries: any;
    }>;
    updateInventoryById(inventoryId: number, editInventoryBodyDto: EditInventoryBodyDto): Promise<any>;
    deleteInventoryById(inventoryId: number): Promise<void>;
    restoreInventoryById(inventoryId: number): Promise<void>;
    reduceInventoryById(inventoryId: number, reduceQuantityBodyDto: ReduceQuantityBodyDto): Promise<any>;
    increaseInventoryById(inventoryId: number, increaseQuantityBodyDto: IncreaseQuantityBodyDto): Promise<any>;
}
