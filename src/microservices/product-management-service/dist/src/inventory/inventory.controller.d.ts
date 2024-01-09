import { InventoryService } from './inventory.service';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';
import { GetAllInventoriesQueryParamsDto, GetInventoriesQueryParamsDto } from './dto/queryParams.dto';
import { EditInventoryBodyDto } from './dto/editInventoryBody.dto';
import { ReduceQuantityBodyDto } from './dto/reduceQuantityBody.dto';
import { IncreaseQuantityBodyDto } from './dto/increaseQuantityBody.dto';
export declare class InventoryController {
    private inventoryService;
    constructor(inventoryService: InventoryService);
    getAllInventories(getAllInventoriesQueryParamsDto: GetAllInventoriesQueryParamsDto): Promise<DefaultResponseDto>;
    getInventoryById(inventoryId: number): Promise<DefaultResponseDto>;
    getAllDeletedInventories(getInventoriesQueryParamsDto: GetInventoriesQueryParamsDto): Promise<DefaultResponseDto>;
    updateInventoryById(inventoryId: number, editInventoryBodyDto: EditInventoryBodyDto): Promise<DefaultResponseDto>;
    deleteInventoryById(inventoryId: number): Promise<DefaultResponseDto>;
    restoreInventoryById(inventoryId: number): Promise<DefaultResponseDto>;
    reduceInventoryQuantityById(inventoryId: number, reduceQuantityBodyDto: ReduceQuantityBodyDto): Promise<DefaultResponseDto>;
    increaseInventoryQuantityById(inventoryId: number, increaseQuantityBodyDto: IncreaseQuantityBodyDto): Promise<DefaultResponseDto>;
}
