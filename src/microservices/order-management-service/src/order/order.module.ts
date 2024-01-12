import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'VERIFY_TOKEN_SERVICE',
        imports: [ConfigModule],
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://user:password@rabbitmq:5672`],
            queue: 'verify-token-queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
})
export class OrderModule {}
