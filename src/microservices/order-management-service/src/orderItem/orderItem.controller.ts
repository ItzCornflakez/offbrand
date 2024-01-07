import { Body, Controller, Delete, Get, Param, Post, Version } from '@nestjs/common';
import { OrderItemService } from './orderItem.service';
import { OrderItemDto } from 'src/common/dto';
import { OrderItem as OrderItemModel } from '@prisma/client';

@Controller('orderItems')
export class OrderItemController {
  constructor(
    private readonly orderItemService: OrderItemService,
    //private readonly rabbitMQService: RabbitMQService
    ) {}

    @Post()
    @Version('1')
    async createOrder(
      @Body() dto: OrderItemDto
    ): Promise<OrderItemModel> {
      //this.rabbitMQService.send('order-queue', {message: "hello"});
  
      return this.orderItemService.createOrderItem(dto);
    }
  
    @Get(':id')
    @Version('1')
    async getOrderItemById(@Param('id') id: string): Promise<OrderItemModel> {
      return this.orderItemService.orderItem({ 
        id: Number(id) 
      });
    }
  
    @Get('backlog:id')
    @Version('1')
    async getOrderItemBacklog(@Param('id') id: string): Promise<OrderItemModel[]> {
      return this.orderItemService.orderItems({
        where: { 
          is_deleted: false,
          order_id: Number(id)
        }
      });
    }
  
    // Add update to different things here
  
    @Delete(':id')
    @Version('1')
    async deleteOrder(@Param('id') id: string): Promise<OrderItemModel> {
      return this.orderItemService.deleteOrderItem({ id: Number(id) });
    }
}
