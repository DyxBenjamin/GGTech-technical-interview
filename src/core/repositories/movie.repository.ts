import {Model, model, models, UpdateQuery} from "mongoose";
import { MovieSchemaInterface, MovieInterface, MovieSchema } from "@core/models/movie.model";

const Movies: Model<MovieSchemaInterface> = models.Movies || model<MovieSchemaInterface>('Movies', MovieSchema);

class MovieRepository {
    /**
     * Creates a new movie.
     * @param movieData - Data for the new movie.
     * @returns The created movie.
     */
    async create(movieData: Omit<MovieInterface, 'id'>): Promise<MovieSchemaInterface> {
        const movie = new Movies(movieData);
        return movie.save();
    }

    /**
     * Finds a movie by its ID.
     * @param movieId - ID of the movie to find.
     * @returns The found movie or null.
     */
    async findById(movieId: string): Promise<MovieSchemaInterface | null> {
        return Movies.findById(movieId).exec();
    }

    /**
     * Updates a movie by its ID.
     * @param movieId - ID of the movie to update.
     * @param update - New data for the movie.
     * @returns The updated movie or null.
     */
    async update(movieId: string, update: UpdateQuery<unknown>): Promise<MovieSchemaInterface | null> {
        return Movies.findByIdAndUpdate(movieId, update, { new: true }).exec();
    }

    /**
     * Deletes a movie by its ID.
     * @param movieId - ID of the movie to delete.
     * @returns The deleted movie or null.
     */
    async delete(movieId: string): Promise<MovieSchemaInterface | null> {
        return Movies.findByIdAndDelete(movieId).exec();
    }

    /**
     * Lists all movies.
     * @param page - Page number.
     * @param limit - Number of movies per page.
     * @returns An array of movies.
     */
    async list({ page, limit }): Promise<MovieSchemaInterface[]> {
        return Movies.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('platforms')
            .populate('reviews')
            .exec();
    }

    /**
     * Counts all movies.
     * @returns The number of movies.
     */
    async count(): Promise<number> {
        return Movies.countDocuments().exec();
    }
}



export default new MovieRepository();
