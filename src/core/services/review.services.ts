import ReviewRepository from "@core/repositories/review.repository";
import {ReviewInterface, ReviewSchemaInterface} from "@core/models/review.model";
import {UpdateQuery} from "mongoose";
import MovieServices from "@core/services/movie.services";

class ReviewServices {
    async createReview(reviewData: Omit<ReviewInterface, 'id'>): Promise<ReviewSchemaInterface> {
        const newReview = await ReviewRepository.create(reviewData);
        await MovieServices.updateMovie(String(reviewData.movie), {$push: {reviews: newReview.id}});
        return newReview;
    }
    async getReviewById(reviewId: string): Promise<ReviewSchemaInterface> {
        return ReviewRepository.findById(reviewId);
    }
    async getReviewsByMovieId(movieId: string): Promise<Array<ReviewSchemaInterface>> {
        return ReviewRepository.findByMovieId(movieId);
    }
    async updateReview(reviewId: string,  update: UpdateQuery<unknown>): Promise<ReviewSchemaInterface> {
        update.updatedAt = new Date();
        return ReviewRepository.update(reviewId, update);
    }
    async deleteReview(reviewId: string): Promise<ReviewSchemaInterface> {
        return ReviewRepository.delete(reviewId);
    }
    async listReviews(): Promise<Array<ReviewSchemaInterface>> {
        return ReviewRepository.list();
    }
}

export default new ReviewServices();
