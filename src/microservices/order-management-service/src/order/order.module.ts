import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/utils/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    PrismaService,
    JwtService
  ],
})
export class OrderModule {}
