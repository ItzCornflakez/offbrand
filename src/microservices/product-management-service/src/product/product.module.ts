import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'PRODUCT_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://user:password@rabbitmq:5672`],
            queue: 'product-queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ]
})
export class ProductModule {}
