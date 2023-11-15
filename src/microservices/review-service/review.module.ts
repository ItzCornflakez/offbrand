import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';

@Module({
    controllers: [ReviewController],
  imports: [],
  providers: []
})
export class ReviewModule {}
