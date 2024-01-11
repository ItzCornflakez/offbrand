import { DynamicModule, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({})
export class ProductModule {
  static register(): DynamicModule {
    const imports = [];
    if (process.env.PMS_RABBITMQ_ENABLED) {
      imports.push(
        ClientsModule.registerAsync([
          {
            name: 'PRODUCT_SERVICE_CATALOG',
            imports: [ConfigModule],
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [`amqp://user:password@rabbitmq:5672`],
                queue: 'pms-catalog-product-queue',
                queueOptions: {
                  durable: false,
                },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      );
      imports.push(
        ClientsModule.registerAsync([
          {
            name: 'PRODUCT_SERVICE_OMS',
            imports: [ConfigModule],
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [`amqp://user:password@rabbitmq:5672`],
                queue: 'pms-oms-product-queue',
                queueOptions: {
                  durable: false,
                },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      );
      imports.push(
        ClientsModule.registerAsync([
          {
            name: 'VERIFY_TOKEN_SERVICE',
            imports: [ConfigModule],
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            useFactory: (configService: ConfigService) => ({
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
      );
    }
    return {
      module: ProductModule,
      imports,
      controllers: [ProductController],
      providers: [ProductService],
    };
  }
}
