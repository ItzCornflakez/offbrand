import { Review, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
export declare class ReviewService {
    private prisma;
    constructor(prisma: PrismaService);
    review(reviewWhereUniqueInput: Prisma.ReviewWhereUniqueInput): Promise<Review | null>;
    reviews(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ReviewWhereUniqueInput;
        where?: Prisma.ReviewWhereInput;
        orderBy?: Prisma.ReviewOrderByWithRelationInput;
    }): Promise<Review[]>;
    createReview(data: Prisma.ReviewCreateInput): Promise<Review>;
    updateReview(params: {
        where: Prisma.ReviewWhereUniqueInput;
        data: Prisma.ReviewUpdateInput;
    }): Promise<Review>;
    deleteReview(where: Prisma.ReviewWhereUniqueInput): Promise<Review>;
}
