import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Order, User, Prisma, Product} from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { OrderDto } from 'src/common/dto';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    async order(
        OrderWhereUniqueInput: Prisma.OrderWhereUniqueInput,
      ): Promise<Order | null> {
        return this.prisma.order.findUnique({
          where: OrderWhereUniqueInput,
        });
    }

    async orders(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.OrderWhereUniqueInput;
        where?: Prisma.OrderWhereInput;
        orderBy?: Prisma.OrderOrderByWithRelationInput;
        include?: Prisma.OrderInclude
      }): Promise<Order[]> {
        const { skip, take, cursor, where, orderBy, include } = params;
        console.log(params)
        return this.prisma.order.findMany({
          skip,
          take,
          cursor,
          where,
          orderBy,
          include,
        });
    }

    async createOrder(data: OrderDto): Promise<Order> {
        return this.prisma.order.create({
          data,
        });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
      return this.prisma.user.create({
        data,
      });
  }

  async createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
}

    async updateOrder(params: {
        where: Prisma.OrderWhereUniqueInput;
        data: Prisma.OrderUpdateInput;
      }): Promise<Order> {
        const { where, data } = params;
        return this.prisma.order.update({
          data,
          where,
        });
    }
    
    async deleteOrder(where: Prisma.OrderWhereUniqueInput): Promise<Order> {
      return this.prisma.order.delete({
          where,
      });
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
      return this.prisma.user.delete({
          where,
      });
    }
}
