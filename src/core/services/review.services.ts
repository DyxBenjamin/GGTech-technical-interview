import ReviewRepository from "@core/repositories/review.repository";
import {ReviewInterface, ReviewSchemaInterface} from "@core/models/review.model";
import {UpdateQuery} from "mongoose";
import MovieServices from "@core/services/movie.services";
import _ from "lodash";
import platformServices from "@core/services/platform.services";

class ReviewServices {
    async createReview(reviewData: Omit<ReviewInterface, 'id'>): Promise<ReviewSchemaInterface> {
        const existMovie = await MovieServices.getMovieById(String(reviewData.movie));
        const existPlatform = await platformServices.getPlatformById(String(reviewData.platform));
        if (_.isEmpty(existMovie)) {
            throw new Error('Movie not found');
        }
        if (_.isEmpty(existPlatform)){
            throw new Error('Platform not found')
        }
        const newReview = await ReviewRepository.create(reviewData);

        await MovieServices.updateMovie(String(reviewData.movie), {$push: {reviews: newReview.id}});
        return newReview;
    }
    async getReviewById(reviewId: string): Promise<ReviewSchemaInterface | null> {
        return ReviewRepository.findById(reviewId);
    }
    async getReviewsByMovieId(movieId: string): Promise<Array<ReviewSchemaInterface>> {
        return ReviewRepository.findByMovieId(movieId);
    }
    async updateReview(reviewId: string,  update: UpdateQuery<unknown>): Promise<ReviewSchemaInterface | null> {
        update.updatedAt = new Date();
        return ReviewRepository.update(reviewId, update);
    }
    async deleteReview(reviewId: string): Promise<ReviewSchemaInterface | null> {
        return ReviewRepository.delete(reviewId);
    }
    async listReviews(): Promise<Array<ReviewSchemaInterface>> {
        return ReviewRepository.list();
    }
}

export default new ReviewServices();
