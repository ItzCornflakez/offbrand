import { Body, Controller, Delete, Get, Param, Post, UseGuards, Version } from '@nestjs/common';
import { OrderDto } from 'src/common/dto';
import { Order as OrderModel, User as UserModel} from '@prisma/client';
import { OrderService } from './order.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AuthGuard } from 'src/common/utils/auth.guard';
import { JwtService } from '@nestjs/jwt';


@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
        ) {}

    // CREATE ENDPOINT

  @Post()
  @UseGuards(new AuthGuard(new JwtService, ['admin', "user"]))
  async createOrder(
    @Body() dto: OrderDto 
  ): Promise<OrderModel> {
    //this.rabbitMQService.send('order-queue', {message: "hello"});

    return this.orderService.createOrder(dto);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<OrderModel> {
    return this.orderService.order({ 
      id: Number(id) 
    });
  }

  @Get('orders:user_id')
  async getOrdersByUserId(@Param('user_id') id: string): Promise<OrderModel[]> {
    return this.orderService.orders({
      where: { 
        user_id: Number(id)
      }
    });
  }

  @Get('orders')
  async getOrders(id: string): Promise<OrderModel[]> {
    return this.orderService.orders({
      where: { 
        user_id: Number(id)
      }
    });
  }

  // Add update to different things here

  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<OrderModel> {
    return this.orderService.deleteOrder({ id: Number(id) });
  }

  @MessagePattern({cmd: 'create-product'})
  async productCreated(@Ctx() context: RmqContext) {
    this.orderService.createProduct({
    })
        
  }

  @MessagePattern({cmd: 'create-user'})
  async userCreated(@Ctx() context: RmqContext) {
    this.orderService.createUser({
    })
        
  }
}
