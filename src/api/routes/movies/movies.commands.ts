import MovieServices from "@core/services/movie.services";
import {Request, Response} from "express";

class MovieCommandController {
    async create(req: Request, res: Response): Promise<void> {
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
    }

    async update(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const movieData = req.body;
        const updatedMovie = await MovieServices.updateMovie(id, movieData);
        res.status(200).json({
            status: 'success',
            message: 'Movie updated',
            data: updatedMovie,
            meta: {
                location: `/api/movies/${updatedMovie.id}`,
                timestamp: new Date().toISOString()
            }
        });
    }

    async delete(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        await MovieServices.deleteMovie(id);
        res.status(204).send({
                status: 'success',
                message: 'Movie deleted',
                meta: {
                    timestamp: new Date().toISOString()
                }
            }
        );
    }
}

export default new MovieCommandController();
