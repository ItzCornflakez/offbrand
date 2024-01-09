import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ReviewService } from './review.service';
import {
  Review as ReviewModel,
} from '@prisma/client';

@Controller()
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService) {}

  // CREATE ENDPOINTS

  @Post('review')
  async createReview(
    @Body()
    reviewData: {
      user_id: number;
      product_id: number
      name: string;
      score: number;
      comment: string;
      dislikes: number;
      likes: number;
    },
  ): Promise<ReviewModel> {
    return this.reviewService.createReview(reviewData);
  }

  // UPDATE ENDPOINTS

  @Put('review/:id')
  async updateReview(
    @Param('id') id: string, 
    @Body()
    reviewData: {
      user_id: number;
      product_id: number
      name: string;
      score: number;
      comment: string;
      dislikes: number;
      likes: number;
    }, ): Promise<ReviewModel> {
    return this.reviewService.updateReview({
      where: { id: Number(id) },
      data: { 
        user_id: reviewData.user_id,
        product_id: reviewData.product_id,
        name: reviewData.name,
        score: reviewData.score,
        comment: reviewData.comment,
        dislikes: reviewData.dislikes,
        likes: reviewData.likes,
      },
    });
  }

  // DELETE ENDPOINTS

  @Delete('review/:id')
  async deleteReview(@Param('id') id: string): Promise<ReviewModel> {
    return this.reviewService.deleteReview({ id: Number(id) });
  }

  // GET ENDPOINTS 

  @Get('review/:id')
  async getReviewById(@Param('id') id: string): Promise<ReviewModel> {
    return this.reviewService.review({ id: Number(id) });
  }


  @Get('reviews')
  async getReviews(): Promise<ReviewModel[]> {
    return this.reviewService.reviews({
      where: {},
    });
  }

}