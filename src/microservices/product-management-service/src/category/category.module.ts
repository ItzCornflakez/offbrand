import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({})
export class CategoryModule {
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
      module: CategoryModule,
      imports,
      controllers: [CategoryController],
      providers: [CategoryService],
    };
  }
}
