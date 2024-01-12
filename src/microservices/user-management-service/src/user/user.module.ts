import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'VERIFY_TOKEN_SERVICE',
        imports: [ConfigModule],
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
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://user:password@rabbitmq:5672`],
            queue: 'ums-oms-user-queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE_RMS',
        imports: [ConfigModule],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://user:password@rabbitmq:5672`],
            queue: 'ums-rms-user-queue',
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
export class UserModule {}