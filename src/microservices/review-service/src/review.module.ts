import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [ReviewController],
  imports: [],
  providers: [ReviewService, PrismaService],
})
export class ReviewModule {}
