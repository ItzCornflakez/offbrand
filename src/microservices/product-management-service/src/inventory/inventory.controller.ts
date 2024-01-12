import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';
import {
  GetAllInventoriesQueryParamsDto,
  GetInventoriesQueryParamsDto,
} from './dto/queryParams.dto';
import { EditInventoryBodyDto } from './dto/editInventoryBody.dto';
import { ReduceQuantityBodyDto } from './dto/reduceQuantityBody.dto';
import { IncreaseQuantityBodyDto } from './dto/increaseQuantityBody.dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Roles } from 'src/common/utils/decorators/roles.decorators';
import { AuthGuard } from 'src/common/utils/guards/auth.guard';
import { RoleGuard } from 'src/common/utils/guards/roles.guard';

@Controller('inventories')
@ApiTags('Inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  @Version('1')
  @ApiOperation({ summary: `Get all inventories` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async getAllInventories(
    @Query() getAllInventoriesQueryParamsDto: GetAllInventoriesQueryParamsDto,
  ): Promise<DefaultResponseDto> {
    const { inventories, totalEntries } =
      await this.inventoryService.getAllInventories(
        getAllInventoriesQueryParamsDto,
      );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Inventories retrived successfully.',
      data: {
        inventories: inventories,
        totalEntries: totalEntries,
      },
    };

    return response;
  }

  @Get('/deleted')
  @Version('1')
  @ApiOperation({ summary: `Get all deleted inventories` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async getAllDeletedInventories(
    @Param() getInventoriesQueryParamsDto: GetInventoriesQueryParamsDto,
  ): Promise<DefaultResponseDto> {
    const { inventories, totalEntries } =
      await this.inventoryService.getAllDeletedInventories(
        getInventoriesQueryParamsDto,
      );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Inventories retrived successfully.',
      data: {
        inventories: inventories,
        totalEntries: totalEntries,
      },
    };

    return response;
  }

  @Get(':id')
  @Version('1')
  @ApiOperation({ summary: `Get a inventory by it's id` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async getInventoryById(
    @Param('id', ParseIntPipe) inventoryId: number,
  ): Promise<DefaultResponseDto> {
    const inventory = await this.inventoryService.getInventoryById(inventoryId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Inventory with ID: '${inventoryId}' was retrived successfully.`,
      data: inventory,
    };

    return response;
  }

  @Put(':id')
  @Version('1')
  @ApiOperation({ summary: `Update a inventory by it's id` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async updateInventoryById(
    @Param('id', ParseIntPipe) inventoryId: number,
    @Body() editInventoryBodyDto: EditInventoryBodyDto,
  ): Promise<DefaultResponseDto> {
    const updatedInventory = await this.inventoryService.updateInventoryById(
      inventoryId,
      editInventoryBodyDto,
    );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Inventory with ID: '${inventoryId}' was updated successfully.`,
      data: updatedInventory,
    };

    return response;
  }

  @Patch(':id/delete')
  @Version('1')
  @ApiOperation({ summary: `Delete a inventory by it's id` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteInventoryById(
    @Param('id', ParseIntPipe) inventoryId: number,
  ): Promise<DefaultResponseDto> {
    await this.inventoryService.deleteInventoryById(inventoryId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Inventory with ID: '${inventoryId}' was deleted successfully.`,
    };

    return response;
  }

  @Patch(':id/restore')
  @Version('1')
  @ApiOperation({ summary: `Restore a inventory by it's id` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async restoreInventoryById(
    @Param('id', ParseIntPipe) inventoryId: number,
  ): Promise<DefaultResponseDto> {
    await this.inventoryService.restoreInventoryById(inventoryId);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Inventory with ID: '${inventoryId}' was restored successfully.`,
    };

    return response;
  }

  @Patch(':id/reduce')
  @Version('1')
  @ApiOperation({ summary: `Reduce the quantity of a inventory by it's id` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async reduceInventoryQuantityById(
    @Param('id', ParseIntPipe) inventoryId: number,
    @Body() reduceQuantityBodyDto: ReduceQuantityBodyDto,
  ): Promise<DefaultResponseDto> {
    const reducedInventory = await this.inventoryService.reduceInventoryById(
      inventoryId,
      reduceQuantityBodyDto,
    );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Inventory with ID: '${inventoryId}' quantity reduced successfully.`,
      data: reducedInventory,
    };

    return response;
  }

  @Patch(':id/increase')
  @Version('1')
  @ApiOperation({ summary: `Increase the quantity of a inventory by it's id` })
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async increaseInventoryQuantityById(
    @Param('id', ParseIntPipe) inventoryId: number,
    @Body() increaseQuantityBodyDto: IncreaseQuantityBodyDto,
  ): Promise<DefaultResponseDto> {
    const increasedInventory =
      await this.inventoryService.increaseInventoryById(
        inventoryId,
        increaseQuantityBodyDto,
      );

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: `Inventory with ID: '${inventoryId}' quantity reduced successfully.`,
      data: increasedInventory,
    };

    return response;
  }

  @MessagePattern({ cmd: 'create-orderitem' })
  async createOrderItem(
    @Payload() payload: { productId: number; color: string; quantity: number },
    @Ctx() context: RmqContext,
  ) {
    console.log('In create Order item');
    console.log('product_id', payload.productId);
    console.log('color', payload.color);
    console.log('quantity', payload.quantity);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.inventoryService.reduceInventoryByOrders(
        payload.productId,
        payload.color,
        payload.quantity,
      );

      channel.ack(originalMsg);

      return true;
    } catch (e) {
      console.log('Error occurs');
      channel.ack(originalMsg);
      return false;
    }
  }
}
