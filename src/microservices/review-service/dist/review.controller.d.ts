import { ReviewService } from './review.service';
import { Review as ReviewModel } from '@prisma/client';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    createReview(reviewData: {
        user_id: number;
        product_id: number;
        name: string;
        score: number;
        comment: string;
        dislikes: number;
        likes: number;
    }): Promise<ReviewModel>;
    updateReview(id: string, reviewData: {
        user_id: number;
        product_id: number;
        name: string;
        score: number;
        comment: string;
        dislikes: number;
        likes: number;
    }): Promise<ReviewModel>;
    deleteReview(id: string): Promise<ReviewModel>;
    getReviewById(id: string): Promise<ReviewModel>;
    getReviews(): Promise<ReviewModel[]>;
}
