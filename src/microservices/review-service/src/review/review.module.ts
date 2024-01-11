import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService, ConfigService],
  imports: [ClientsModule.registerAsync([
    {
      name: 'REVIEW_SERVICE',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://user:password@rabbitmq:5672`],
          queue: 'review-queue',
          queueOptions: {
            durable: false,
          },
        },
      }),
      inject: [ConfigService],
    },
  ]),],
  
})
export class ReviewModule {}
