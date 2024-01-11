import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OrderItem, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { lastValueFrom } from 'rxjs';
import { OrderItemDto } from 'src/common/dto';

@Injectable()
export class OrderItemService {
    constructor(private prisma: PrismaService,
      @Inject('CREATE_ORDERITEM_SERVICE') private readonly client: ClientProxy) {}

    async orderItem(
        OrderItemItemWhereUniqueInput: Prisma.OrderItemWhereUniqueInput,
      ): Promise<OrderItem | null> {
        return this.prisma.orderItem.findUnique({
          where: OrderItemItemWhereUniqueInput,
        });
    }

    async orderItems(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.OrderItemWhereUniqueInput;
        where?: Prisma.OrderItemWhereInput;
        orderBy?: Prisma.OrderItemOrderByWithRelationInput;
      }): Promise<OrderItem[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.orderItem.findMany({
          skip,
          take,
          cursor,
          where,
          orderBy,
        });
    }

    async createOrderItem(data: OrderItemDto): Promise<OrderItem> {

      let createdOrderItem: OrderItem

      try{

        await this.prisma.$transaction(async (transactionClient) => {

          createdOrderItem = await transactionClient.orderItem.create({
            data,
          })

          const result = this.client.send({ cmd: 'create-orderitem' }, {productId: createdOrderItem.product_id, color: createdOrderItem.color, quantity: createdOrderItem.quantity, })
          const inventoryExists = await lastValueFrom(result)
          console.log(inventoryExists)

          if(!inventoryExists){
            throw new Error("Not enough inventory")
          }
          
        });
      } catch(e){
        console.log("Error during transaction:", e);
        throw e
      }

      return createdOrderItem
      
    }

    async updateOrderItem(params: {
        where: Prisma.OrderItemWhereUniqueInput;
        data: Prisma.OrderItemUpdateInput;
      }): Promise<OrderItem> {
        const { where, data } = params;
        return this.prisma.orderItem.update({
          data,
          where,
        });
    }
    
    async deleteOrderItem(where: Prisma.OrderItemWhereUniqueInput): Promise<OrderItem> {
    return this.prisma.orderItem.delete({
        where,
    });
    }

}
