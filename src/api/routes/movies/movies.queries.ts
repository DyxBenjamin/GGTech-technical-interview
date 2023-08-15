import {NextFunction, Request, Response} from 'express';
import MovieServices from "@core/services/movie.services";
import {ServerError} from "@api/middlewares/errorHandlingMiddleware";

class MovieQueryController {
    async getById(req: Request, res: Response, next: NextFunction ): Promise<void> {
        try {
            const { id } = req.params;
            const movie = await MovieServices.getMovieById(id);
            if (!movie) {
                throw new ServerError('NOT_FOUND')
            }
            res.status(200).json({
                status: 'success',
                message: 'Movie found',
                data: movie,
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        } catch (e) {
            next(e)
        }
    }

    async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page: number = Number(req.query.page) || 1;
            const limit: number = Number(req.query.limit) || 10;
            const movies = await MovieServices.listMovies({ page, limit });
            const count = await MovieServices.countMovies();
            if (!movies && count === 0 ) {
                throw new ServerError('NOT_FOUND')
            }
            res.status(200).json({
                status: 'success',
                data: movies,
                pagination: {
                    page:{
                        current: page,
                        size: limit,
                        total: Math.ceil(count/limit)
                    },
                    items:{
                        count: count
                    },
                    links:{
                        first: `/api/movies?page=1&limit=${limit}`,
                        previous: page > 1 ? `/api/movies?page=${page-1}&limit=${limit}` : null,
                        next: page < Math.ceil(count/limit) ? `/api/movies?page=${page+1}&limit=${limit}` : null,
                        last: `/api/movies?page=${Math.ceil(count/limit)}&limit=${limit}`
                    }
                },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        } catch (e) {
            next(e)
        }

    }
}

export default new MovieQueryController();
