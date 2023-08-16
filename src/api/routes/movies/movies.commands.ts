import MovieServices from "@core/services/movie.services";
import {NextFunction, Request, Response} from "express";
import {ServerError} from "@api/middlewares/errorHandlingMiddleware";

class MovieCommandController {
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const movieData = req.body;
            const newMovie = await MovieServices.createMovie(movieData);
            res.status(201).json({
                status: 'success',
                message: 'Movie created',
                data: newMovie,
                meta: {
                    location: `/api/movies/${newMovie.id}`,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (e) {
            next(e)
        }
    }

    async clone(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.params;
            const clonedMovie = await MovieServices.cloneMovie(id);
            res.status(201).json({
                status: 'success',
                message: 'Movie cloned',
                data: clonedMovie,
                meta: {
                    location: `/api/movies/${clonedMovie?.id}`,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (e) {
            next(e)
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.params;
            const movieData = req.body;
            const updatedMovie = await MovieServices.updateMovie(id, movieData);
            res.status(200).json({
                status: 'success',
                message: 'Movie updated',
                data: updatedMovie,
                meta: {
                    location: `/api/movies/${updatedMovie?.id}`,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (e) {
            next(e)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.params;
            const movie = await MovieServices.deleteMovie(id);
            if (!movie) {
                throw new ServerError('NOT_FOUND');
            }
            res.status(200).send({
                    status: 'success',
                    message: 'Movie and reviews deleted',
                    meta: {
                        timestamp: new Date().toISOString()
                    }
                }
            );
        } catch (e) {
            next(e)
        }
    }
}

export default new MovieCommandController();
