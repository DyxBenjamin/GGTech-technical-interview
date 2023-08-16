import {HydratedDocument, Model, model, models, Types, UpdateQuery} from "mongoose";
import {MovieInterface, MovieSchema, MovieSchemaInterface} from "@core/models/movie.model";

const Movies: Model<MovieSchemaInterface> = models.Movies || model<MovieSchemaInterface>('Movies', MovieSchema);

class MovieRepository {
    /**
     * Creates a new movie.
     * @param movieData - Data for the new movie.
     * @returns The created movie.
     */
    async create(movieData: Omit<MovieInterface, 'id'>): Promise<MovieSchemaInterface> {
        const newMovie = new Movies(movieData);
        return newMovie.save();
    }

    /**
     * Finds a movie by its ID.
     * @param movieId - ID of the movie to find.
     * @returns The found movie or null.
     */
    async findById(movieId: string): Promise<MovieSchemaInterface | null> {
        return Movies.findById(movieId).exec();
    }

    async findAndGroupByPlatform(movieId: string): Promise<Array<HydratedDocument<MovieSchemaInterface, unknown>>> {
        return Movies.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(movieId)
                },
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "movie",
                    as: "reviews",
                },
            },
            {
                $unwind: "$reviews",
            },
            {
                $lookup: {
                    from: "platforms",
                    localField: "reviews.platform",
                    foreignField: "_id",
                    as: "platformInfo",
                },
            },
            {
                $unwind: "$platformInfo",
            },
            {
                $group: {
                    _id: {
                        platform: "$platformInfo.title",
                        movieId: "$_id"
                    },
                    movieInfo: {
                        $first: "$$ROOT"
                    },
                    reviews: {
                        $push: "$reviews"
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.movieId",
                    movieInfo: {
                        $first: "$movieInfo"
                    },
                    reviewsGroups: {
                        $push: {
                            platform: "$_id.platform",
                            reviews: "$reviews"
                        }
                    }
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$movieInfo", {platformReviews: "$reviewsGroups"}]
                    }
                }
            },
            {
                $set: {
                    id: "$_id"
                }
            },
            {
                $project: {
                    _id: 0,
                    platformInfo: 0,
                    platforms: 0,
                    reviews: 0,
                    __v: 0
                }
            }
        ]).exec();
    }

    async findBySlug(movieSlug: string): Promise<Array<HydratedDocument<MovieSchemaInterface, unknown>>> {
        return Movies.find({ slug: movieSlug }).exec();
    }

    /**
     * Updates a movie by its ID.
     * @param movieId - ID of the movie to update.
     * @param update - New data for the movie.
     * @returns The updated movie or null.
     */
    async update(movieId: string, update: UpdateQuery<unknown>): Promise<MovieSchemaInterface | null> {
        return Movies.findByIdAndUpdate(movieId, update).exec();
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
    async list({ page, limit } : { page: number, limit: number }): Promise<MovieSchemaInterface[]> {
        return Movies.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('reviews')
            .populate('platforms')
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
