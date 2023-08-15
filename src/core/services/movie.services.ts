import MovieRepository from "@core/repositories/movie.repository";
import {MovieInterface, MovieSchemaInterface} from "@core/models/movie.model";
import {HydratedDocument, UpdateQuery} from "mongoose";
import * as _ from "lodash";
import ReviewServices from "@core/services/review.services";

class MovieServices {

    // QUERIES
    async getMovieById(movieId: string):  Promise<Array<HydratedDocument<MovieSchemaInterface, unknown>>> {
        return MovieRepository.findAndGroupByPlatform(movieId);
    }

    async listMovies({page, limit}): Promise<Array<MovieSchemaInterface>> {
        return MovieRepository.list({page, limit});
    }

    async countMovies(): Promise<number> {
        return MovieRepository.count();
    }

    // COMMANDS
    async createMovie(movieData: Omit<MovieInterface, 'id'>): Promise<MovieSchemaInterface> {
        return MovieRepository.create(movieData);
    }

    async cloneMovie(movieId: string): Promise<MovieSchemaInterface> {
        const movie = await MovieRepository.findById(movieId);
        if (!movie) {
            throw new Error('Movie not found');
        }
        const newSlug = await generateNewSlug(movie.slug);
        const newMovie = await MovieRepository.create({
            title: movie.title,
            overview: movie.overview,
            image: movie.image,
            director: movie.director,
            languages: movie.languages,
            genre: movie.genre,
            platforms: movie.platforms,
            slug: newSlug
        });
        await Promise.all(movie.reviews.map(async (reviewId) => {
            const review = await ReviewServices.getReviewById(String(reviewId));
            const newReview = await ReviewServices.createReview({
                movie: newMovie.id,
                score: review.score,
                body: review.body,
                author: review.author,
                platform: review.platform,
            });
            await MovieRepository.update(newMovie.id, {$push: {reviews: newReview.id}});
        }))
        return MovieRepository.findById(newMovie.id);
    }

    async updateMovie(movieId: string, update: UpdateQuery<unknown>): Promise<MovieSchemaInterface> {
        update.updatedAt = Date.now();
        return MovieRepository.update(movieId, {$set: update});
    }

    async deleteMovie(movieId: string): Promise<MovieSchemaInterface> {
        const reviews = await ReviewServices.getReviewsByMovieId(movieId);
        await Promise.all(reviews.map(async (review) => {
            await ReviewServices.deleteReview(String(review.id));
        }));
        return MovieRepository.delete(movieId);
    }
}

async function generateNewSlug(slug: string, iteration: number = 1): Promise<string> {
    const newSlug = `${slug}-clone-${iteration}`;
    const movie = await MovieRepository.findBySlug(newSlug);
    if (_.isEmpty(movie)) {
        return newSlug;
    }
    return generateNewSlug(slug, iteration + 1);
}

export default new MovieServices();
