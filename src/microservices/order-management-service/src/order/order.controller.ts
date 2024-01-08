import { Body, Controller, Delete, Get, Param, Post, Version } from '@nestjs/common';
import { OrderDto } from 'src/common/dto';
import { Order as OrderModel, User as UserModel} from '@prisma/client';
import { OrderService } from './order.service';
import { UserDto } from 'src/common/dto';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';


@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
        ) {}

    // CREATE ENDPOINT

  @Post()
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

  @Get('backlog:id')
  async getOrderBacklog(@Param('id') id: string, @Body() dto: OrderDto): Promise<OrderModel[]> {
    return this.orderService.orders({
      where: { 
        is_deleted: false,
        user_id: Number(id)
      }
    });
  }

  // Add update to different things here

  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<OrderModel> {
    return this.orderService.deleteOrder({ id: Number(id) });
  }

  @Post('user')
  async createUser(
    @Body() dto: UserDto
  ): Promise<UserModel> {
    //this.rabbitMQService.send('order-queue', {message: "hello"});
    console.log("hello")

    return this.orderService.createUser(dto);
  }

  @MessagePattern({cmd: 'create-product'})
  async productCreated(@Ctx() context: RmqContext) {
    console.log("in here 2")
    this.orderService.createProduct({
    })
        
  }
}
