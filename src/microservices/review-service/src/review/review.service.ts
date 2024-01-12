import { Injectable } from '@nestjs/common';
import { Review, Prisma, User, Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewDto } from 'src/common/dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async review(
    reviewWhereUniqueInput: Prisma.ReviewWhereUniqueInput,
  ): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: reviewWhereUniqueInput,
    });
  }

  async reviews(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ReviewWhereUniqueInput;
    where?: Prisma.ReviewWhereInput;
    orderBy?: Prisma.ReviewOrderByWithRelationInput;
  }): Promise<Review[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.review.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createReview(data: ReviewDto): Promise<Review> {
    return await this.prisma.review.create({
      data,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    console.log('In RMS createUser function');
    return await this.prisma.user.create({
      data,
    });
  }

  async createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
    return await this.prisma.product.create({
      data,
    });
  }

  async updateReview(params: {
    where: Prisma.ReviewWhereUniqueInput;
    data: Prisma.ReviewUpdateInput;
  }): Promise<Review> {
    const { where, data } = params;
    return await this.prisma.review.update({
      data,
      where,
    });
  }

  async deleteReview(where: Prisma.ReviewWhereUniqueInput): Promise<Review> {
    return await this.prisma.review.delete({
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.prisma.user.delete({
      where,
    });
  }
}
