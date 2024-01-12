import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  Version,
} from '@nestjs/common';
import { OrderItemService } from './orderItem.service';
import {
  DefaultResponseDto,
  EditOrderItemDto,
  OrderItemDto,
} from 'src/common/dto';
import { OrderItem as OrderItemModel, Status } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/utils/decorators/roles.decorators';
import { AuthGuard } from 'src/common/utils/guards/auth.guard';
import { RoleGuard } from 'src/common/utils/guards/roles.guard';

@Controller('orderItems')
@ApiTags('OrderItem')
export class OrderItemController {
  constructor(
    private readonly orderItemService: OrderItemService,
    //private readonly rabbitMQService: RabbitMQService
  ) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: `Create a orderItem` })
  @Roles('admin', 'employee', 'user')
  @UseGuards(AuthGuard, RoleGuard)
  async createOrderItem(
    @Body() dto: OrderItemDto,
  ): Promise<DefaultResponseDto> {
    try {
      const createdOrderItem = await this.orderItemService.createOrderItem(dto);

      const response: DefaultResponseDto = {
        status: 'Success',
        statusCode: HttpStatus.CREATED,
        statusText: 'Order item created successfully.',
        data: createdOrderItem,
      };

      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  @Get('orderItems')
  @Version('1')
  @ApiOperation({ summary: `Get all orderItems` })
  @Roles('admin', 'employee')
  @UseGuards(AuthGuard, RoleGuard)
  async getAllOrderItems(): Promise<DefaultResponseDto> {
    const orderItems = await this.orderItemService.orderItems({});

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All order items retrieved successfully.',
      data: orderItems,
    };

    return response;
  }

  @Get(':id')
  @Version('1')
  @ApiOperation({ summary: `Get orderItem by id` })
  @Roles('admin', 'employee', 'user')
  @UseGuards(AuthGuard, RoleGuard)
  async getOrderItemById(@Param('id') id: string): Promise<OrderItemModel> {
    return this.orderItemService.orderItem({
      id: Number(id),
    });
  }

  @Get(':order_id')
  @Version('1')
  @ApiOperation({ summary: `Get orderItems by order id` })
  @Roles('admin', 'employee', 'user')
  @UseGuards(AuthGuard, RoleGuard)
  async getOrderItemsByOrderId(
    @Param('order_id') id: string,
  ): Promise<OrderItemModel[]> {
    return this.orderItemService.orderItems({
      where: {
        order_id: Number(id),
      },
    });
  }

  @Put(':id')
  @Version('1')
  @ApiOperation({ summary: `Update orderItem by id` })
  @Roles('admin', 'employee')
  @UseGuards(AuthGuard, RoleGuard)
  async editOrderItem(
    @Param('id') id: string,
    @Body() editOrderItemDto: EditOrderItemDto,
  ): Promise<DefaultResponseDto> {
    const orderItem = await this.orderItemService.updateOrderItem({
      where: { id: Number(id) },
      data: { ...editOrderItemDto, updated_at: new Date() },
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Order updated successfully.',
      data: orderItem,
    };

    return response;
  }

  // Add update to different things here

  @Patch(':id/delete')
  @Version('1')
  @ApiOperation({ summary: `Soft delete orderItem by id` })
  @Roles('admin', 'employee', 'user')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteOrderItemStatus(
    @Param('id') id: string,
  ): Promise<DefaultResponseDto> {
    const orderItem = await this.orderItemService.updateOrderItem({
      where: { id: Number(id) },
      data: { status: Status.Deleted },
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Orderitem soft deleted successfully.',
      data: orderItem,
    };

    return response;
  }

  @Patch(':id/restore')
  @Version('1')
  @ApiOperation({ summary: `Restore orderItem by id` })
  @Roles('admin', 'employee', 'user')
  @UseGuards(AuthGuard, RoleGuard)
  async restoreOrderItemStatus(
    @Param('id') id: string,
  ): Promise<DefaultResponseDto> {
    const orderItem = await this.orderItemService.updateOrderItem({
      where: { id: Number(id) },
      data: { status: Status.Open },
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Orderitem restored successfully.',
      data: orderItem,
    };

    return response;
  }

  @Patch(':id/close')
  @Version('1')
  @ApiOperation({ summary: `Close orderItem by id` })
  @Roles('admin', 'employee', 'user')
  @UseGuards(AuthGuard, RoleGuard)
  async closeOrderItemStatus(
    @Param('id') id: string,
  ): Promise<DefaultResponseDto> {
    const orderItem = await this.orderItemService.updateOrderItem({
      where: { id: Number(id) },
      data: { status: Status.Closed },
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Orderitem closed successfully.',
      data: orderItem,
    };

    return response;
  }
}
