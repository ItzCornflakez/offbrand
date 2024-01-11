import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ReviewService } from './review.service';
import {Review as ReviewModel,} from '@prisma/client';
import { Ctx, MessagePattern, RmqContext, Payload } from '@nestjs/microservices';
import { ReviewDto } from 'src/common/dto/review.dto';
import { DefaultResponseDto } from 'src/common/dto/deafultResponse.dto';

@Controller()
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService) {}

  // CREATE ENDPOINTS

  @Post('review')
  async createReview(
    @Body() dto: ReviewDto
    ): Promise<DefaultResponseDto> {
      console.log(dto)
      const newReview = await this.reviewService.createReview(dto);
  
      const response: DefaultResponseDto = {
        status: 'Success',
        statusCode: HttpStatus.CREATED,
        statusText: 'Review created successfully.',
        data: newReview,
      };
  
      return response;
    }

  // UPDATE ENDPOINTS

  @Put('review/:id')
  async updateReview(
    @Param('id') id: string,
    @Body() reviewDto: ReviewDto
  ,
  ): Promise<DefaultResponseDto> {
      const updatedReview = await this.reviewService.updateReview({where: { id: Number(id) },
        data: {...reviewDto}});

     const response: DefaultResponseDto = {
      status: 'Success',
      statusCode: HttpStatus.CREATED,
      statusText: `Review for user with ID: ${id} updated successfully.`,
      data: updatedReview,
    };

    return response;
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

  @MessagePattern({cmd: 'create-user'})
  async userCreated(@Ctx() context: RmqContext) {
    this.reviewService.createUser({
    })
        
  }

  @MessagePattern({cmd: 'create-product'})
  async productCreated(@Ctx() context: RmqContext) {
    this.reviewService.createProduct({
    })
        
  }

  @MessagePattern({cmd: 'delete-user'})
  async userDeleted(@Payload() id: any, @Ctx() context: RmqContext) {
    this.reviewService.deleteUser({id: id})
        
  }

}

