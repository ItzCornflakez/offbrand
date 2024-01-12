import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { DefaultResponseDto, OrderDto } from 'src/common/dto';
import { Status } from '@prisma/client';
import { OrderService } from './order.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthGuard } from 'src/common/utils/guards/auth.guard';
import { RoleGuard } from 'src/common/utils/guards/roles.guard';
import { Roles } from 'src/common/utils/decorators/roles.decorators';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EditOrderDto } from 'src/common/dto/editOrder.dto';

@Controller('orders')
@ApiTags('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: `Create a order` })
  @Roles('admin', 'employee', 'user')
  @UseGuards(AuthGuard, RoleGuard)
  async createOrder(@Body() dto: OrderDto): Promise<DefaultResponseDto> {
    console.log(dto);
    const newOrder = await this.orderService.createOrder(dto);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.CREATED,
      statusText: 'Order created successfully.',
      data: newOrder,
    };

    return response;
  }

  @Get('myOrders')
  @Version('1')
  @ApiOperation({ summary: `Get all orders` })
  @Roles('admin', 'employee')
  @UseGuards(AuthGuard, RoleGuard)
  async findmyOrders(@Req() req): Promise<DefaultResponseDto> {
    const orders = await this.orderService.orders({
      where: { user_id: req.user.id },
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All orders retrieved successfully.',
      data: orders,
    };

    return response;
  }

  @Get('orders')
  @Version('1')
  @ApiOperation({ summary: `Get all orders` })
  @Roles('admin', 'employee')
  @UseGuards(AuthGuard, RoleGuard)
  async findAllOrders(@Req() req): Promise<DefaultResponseDto> {
    const orders = await this.orderService.orders({
      where: { user_id: req.user.id },
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All orders retrieved successfully.',
      data: orders,
    };

    return response;
  }

  @Get(':id')
  @Version('1')
  @ApiOperation({ summary: `Get a order by id` })
  @Roles('admin', 'employee', 'user')
  @UseGuards(AuthGuard, RoleGuard)
  async getOrderById(@Param('id') id: string): Promise<DefaultResponseDto> {
    const order = await this.orderService.order({
      id: Number(id),
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Order retrieved successfully.',
      data: order,
    };

    return response;
  }

  @Get('orders/:user_id/all')
  @Version('1')
  @ApiOperation({ summary: `Get all orders for a specific user` })
  @Roles('admin', 'employee')
  @UseGuards(AuthGuard, RoleGuard)
  async getAllOrdersByUserId(
    @Param('user_id') id: string,
  ): Promise<DefaultResponseDto> {
    const orders = await this.orderService.orders({
      where: {
        user_id: Number(id),
      },
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All orders retrieved successfully.',
      data: orders,
    };

    return response;
  }

  @Get('orders/:user_id/active')
  @Version('1')
  @ApiOperation({ summary: `Get all active orders for a specific user` })
  @Roles('admin', 'employee')
  @UseGuards(AuthGuard, RoleGuard)
  async getActiveOrdersByUserId(
    @Param('user_id') id: string,
  ): Promise<DefaultResponseDto> {
    const orders = await this.orderService.orders({
      where: {
        user_id: Number(id),
        status: Status.Open,
      },
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All active orders retrieved successfully.',
      data: orders,
    };

    return response;
  }

  @Get('orders/:user_id/all/orderItems')
  @Version('1')
  @ApiOperation({
    summary: `Get all orders with orderItems for a specific user`,
  })
  @Roles('admin', 'employee')
  @UseGuards(AuthGuard, RoleGuard)
  async getAllOrdersWithOrderItemsByUserId(
    @Param('user_id') id: string,
  ): Promise<DefaultResponseDto> {
    const orders = await this.orderService.orders({
      where: {
        user_id: Number(id),
      },
      include: {
        ordersItems: true,
      },
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All orders retrieved successfully.',
      data: orders,
    };

    return response;
  }

  @Patch(':id/delete')
  @Version('1')
  @ApiOperation({ summary: `Soft delete order by id` })
  @Roles('admin', 'employee', 'user')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteOrderItemStatus(
    @Param('id') id: string,
  ): Promise<DefaultResponseDto> {
    const orderItem = await this.orderService.updateOrder({
      where: { id: Number(id) },
      data: { status: Status.Deleted },
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Order soft deleted successfully.',
      data: orderItem,
    };

    return response;
  }

  @Put(':id')
  @Version('1')
  @ApiOperation({ summary: `Restore order by id` })
  @Roles('admin', 'employee')
  @UseGuards(AuthGuard, RoleGuard)
  async editOrderItem(
    @Param('id') id: string,
    @Body() editOrderDto: EditOrderDto,
  ): Promise<DefaultResponseDto> {
    const orderItem = await this.orderService.updateOrder({
      where: { id: Number(id) },
      data: { ...editOrderDto, updated_at: new Date() },
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Order updated successfully.',
      data: orderItem,
    };

    return response;
  }

  @Patch(':id/restore')
  @Version('1')
  @ApiOperation({ summary: `Restore order by id` })
  @Roles('admin', 'employee', 'user')
  @UseGuards(AuthGuard, RoleGuard)
  async restoreOrderItemStatus(
    @Param('id') id: string,
  ): Promise<DefaultResponseDto> {
    const orderItem = await this.orderService.updateOrder({
      where: { id: Number(id) },
      data: { status: Status.Open },
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Order restored successfully.',
      data: orderItem,
    };

    return response;
  }

  @Patch(':id/close')
  @Version('1')
  @ApiOperation({ summary: `Close order by id` })
  @Roles('admin', 'employee', 'user')
  @UseGuards(AuthGuard, RoleGuard)
  async closeOrderItemStatus(
    @Param('id') id: string,
  ): Promise<DefaultResponseDto> {
    const orderItem = await this.orderService.updateOrder({
      where: { id: Number(id) },
      data: { status: Status.Closed },
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Order closed successfully.',
      data: orderItem,
    };

    return response;
  }

  @MessagePattern({ cmd: 'create-product' })
  async productCreated(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.orderService.createProduct({});

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'create-user' })
  async userCreated(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.orderService.createUser({});

    channel.ack(originalMsg);
  }

  @MessagePattern({ cmd: 'delete-user' })
  async userDeleted(@Payload() id: number, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.orderService.deleteUser({ id: id });

    channel.ack(originalMsg);
  }
}
