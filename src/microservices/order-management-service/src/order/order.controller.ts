import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Patch, Post, UseGuards, Version } from '@nestjs/common';
import { DefaultResponseDto, OrderDto } from 'src/common/dto';
import { Order as OrderModel, Status, User as UserModel} from '@prisma/client';
import { OrderService } from './order.service';
import { ClientProxy, Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AuthGuard } from 'src/common/utils/guards/auth.guard';
import { RoleGuard } from 'src/common/utils/guards/roles.guard';
import { Roles } from 'src/common/utils/decorators/roles.decorators';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { response } from 'express';


@Controller('orders')
@ApiTags('Order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
        ) {}

    // CREATE ENDPOINT

  @Post()
  @Version('1')
  @ApiOperation({ summary: `Create a order` })
  @Roles('admin', 'employee', 'user')
  @UseGuards(AuthGuard, RoleGuard)
  async createOrder(
    @Body() dto: OrderDto 
  ): Promise<DefaultResponseDto> {
    console.log(dto)
    const newOrder = await this.orderService.createOrder(dto);

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.CREATED,
      statusText: 'Order created successfully.',
      data: newOrder,
    };

    return response;
  }

  @Get('orders')
  @Version('1')
  @ApiOperation({ summary: `Get all orders` })
  @Roles('admin', 'employee')
  @UseGuards(AuthGuard, RoleGuard)
  async findAllRelevantOrders(): Promise<DefaultResponseDto> {
      const orders = await this.orderService.orders({
      
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All orders retrieved successfully.',
      data: orders,
    };

    return response
  }
  
  @Get(':id')
  @Version('1')
  @ApiOperation({ summary: `Get a order by id` })
  @Roles('admin', 'employee', 'user')
  @UseGuards(AuthGuard, RoleGuard)
  async getOrderById(@Param('id') id: string
  ): Promise<DefaultResponseDto> {
    const order = await this.orderService.order({ 
      id: Number(id)
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Order retrieved successfully.',
      data: order,
    };

    return response
  }

  @Get('orders/:user_id')
  @Version('1')
  @ApiOperation({ summary: `Get all orders for a specific user` })
  @Roles('admin', 'employee')
  @UseGuards(AuthGuard, RoleGuard)
  async getOrdersByUserId(@Param('user_id') id: string
  ): Promise<DefaultResponseDto> {
    const orders = await this.orderService.orders({
      where: { 
        user_id: Number(1),
        status: Status.Open
      }
    });

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'All orders retrieved successfully.',
      data: orders,
    };

    return response
  }

  @Patch(':id/delete')
  @Version('1')
  @ApiOperation({ summary: `Soft delete order by id` })
  @Roles('admin', 'employee', 'user')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteOrderItemStatus(@Param('id') id: string
  ): Promise<DefaultResponseDto> {
    const orderItem = await this.orderService.updateOrder({ where: {id: Number(id) }, data: {status: Status.Deleted}});

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Order soft deleted successfully.',
      data: orderItem,
    };

    return response;
  }

  @Patch(':id/restore')
  @Version('1')
  @ApiOperation({ summary: `Restore order by id` })
  @Roles('admin', 'employee', 'user')
  @UseGuards(AuthGuard, RoleGuard)
  async restoreOrderItemStatus(@Param('id') id: string
  ): Promise<DefaultResponseDto> {
    const orderItem = await this.orderService.updateOrder({ where: {id: Number(id) }, data: {status: Status.Open}});

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
  async closeOrderItemStatus(@Param('id') id: string
  ): Promise<DefaultResponseDto> {
    const orderItem = await this.orderService.updateOrder({ where: {id: Number(id) }, data: {status: Status.Closed}});

    const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.OK,
      statusText: 'Order closed successfully.',
      data: orderItem,
    };

    return response;
  }

  @MessagePattern({cmd: 'create-product'})
  async productCreated(@Ctx() context: RmqContext) {
    console.log('in create product')
    this.orderService.createProduct({
    })
        
  }

  @MessagePattern({cmd: 'create-user'})
  async userCreated(@Ctx() context: RmqContext) {
    this.orderService.createUser({
    })
        
  }

  @MessagePattern({cmd: 'delete-user'})
  async userDeleted(@Payload() id: any, @Ctx() context: RmqContext) {
    this.orderService.deleteUser({id: Number(id)})
        
  }
}

