import {Model, model, models, UpdateQuery} from "mongoose";
import {ReviewInterface, ReviewSchema, ReviewSchemaInterface} from "@core/models/review.model";

const Reviews: Model<ReviewSchemaInterface> = models.Reviews || model<ReviewSchemaInterface>('Reviews', ReviewSchema);

class ReviewRepository {
    /**
     * Creates a new review.
     * @param reviewData - Data for the new review.
     * @returns The created review.
     */
    async create(reviewData: Omit<ReviewInterface, 'id'>): Promise<ReviewSchemaInterface> {
        const review = new Reviews(reviewData);
        return review.save();
    }

    /**
     * Finds a review by its ID.
     * @param reviewId - ID of the review to find.
     * @returns The found review or null.
     */
    async findById(reviewId: string): Promise<ReviewSchemaInterface | null> {
        return Reviews.findById(reviewId).exec();
    }

    /**
     * Finds all reviews for a movie by its ID.
     * @param movieId
     * @returns An array of reviews.
     */
    async findByMovieId(movieId: string): Promise<Array<ReviewSchemaInterface>> {
        return Reviews.find({ movie: movieId }).exec();
    }

    /**
     * Updates a review by its ID.
     * @param reviewId - ID of the review to update.
     * @param update - New data for the review.
     * @returns The updated review or null.
     */
    async update(reviewId: string,  update: UpdateQuery<unknown>): Promise<ReviewSchemaInterface | null> {
        return Reviews.findByIdAndUpdate(reviewId, update).exec();
    }

    /**
     * Deletes a review by its ID.
     * @param reviewId - ID of the review to delete.
     * @returns The deleted review or null.
     */
    async delete(reviewId: string): Promise<ReviewSchemaInterface | null> {
        return Reviews.findByIdAndDelete(reviewId).exec();
    }

    /**
     * Lists all reviews.
     * @returns An array of all reviews.
     */
    async list(): Promise<ReviewSchemaInterface[]> {
        return Reviews.find().exec();
    }
}

export default new ReviewRepository();
