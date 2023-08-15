import ReviewRepository from "@core/repositories/review.repository";
import {ReviewInterface, ReviewSchemaInterface} from "@core/models/review.model";
import MovieRepository from "@core/repositories/movie.repository";

class ReviewServices {
    async createReview(reviewData: Omit<ReviewInterface, 'id'>): Promise<ReviewSchemaInterface> {
        const newReview = await ReviewRepository.create(reviewData);
        await MovieRepository.update(String(reviewData.movie), {$push: {reviews: newReview.id}});
        return newReview;
    }
    async getReviewById(reviewId: string): Promise<ReviewSchemaInterface> {
        return ReviewRepository.findById(reviewId);
    }
    async updateReview(reviewId: string, reviewData: Partial<ReviewInterface>): Promise<ReviewSchemaInterface> {
        return ReviewRepository.update(reviewId, reviewData);
    }
    async deleteReview(reviewId: string): Promise<ReviewSchemaInterface> {
        return ReviewRepository.delete(reviewId);
    }
    async listReviews(): Promise<Array<ReviewSchemaInterface>> {
        return ReviewRepository.list();
    }
}

export default new ReviewServices();
