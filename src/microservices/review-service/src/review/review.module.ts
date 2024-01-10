import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';


@Module({
  controllers: [ReviewController],
  imports: [],
  providers: [ReviewService, PrismaService, ConfigService],
})
export class ReviewModule {}
