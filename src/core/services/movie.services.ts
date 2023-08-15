import MovieRepository from "@core/repositories/movie.repository";
import {MovieInterface, MovieSchemaInterface} from "@core/models/movie.model";

class MovieServices {

    // QUERIES
    async getMovieById(movieId: string): Promise<MovieSchemaInterface> {
        return MovieRepository.findById(movieId);
    }
    async listMovies({page, limit}) : Promise<Array<MovieSchemaInterface>> {
        return MovieRepository.list({page, limit});
    }
    async countMovies() : Promise<number> {
        return MovieRepository.count();
    }

    // COMMANDS
    async createMovie(movieData: Omit<MovieInterface, 'id'>): Promise<MovieSchemaInterface> {
        return MovieRepository.create(movieData);
    }
    async cloneMovie(movieId: string): Promise<MovieSchemaInterface> {
        const movie = await MovieRepository.findById(movieId);
        if (!movie) {throw new Error('Movie not found');}
        return MovieRepository.create(movie);
    }
    async updateMovie(movieId: string, movieData: Partial<MovieInterface>): Promise<MovieSchemaInterface> {
        return MovieRepository.update(movieId, movieData);
    }
    async deleteMovie(movieId: string) : Promise<MovieSchemaInterface> {
        return MovieRepository.delete(movieId);
    }
}

export default new MovieServices();
