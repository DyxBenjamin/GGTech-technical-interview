import ReviewServices from "@core/services/review.services";
import {NextFunction, Request, Response} from "express";

class ReviewsCommandsController {
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const reviewData = req.body;
            const {movieId} = req.params;
            const payload = {
                ...reviewData,
                movie: movieId
            }
            const newReview = await ReviewServices.createReview(payload);
            res.status(201).json({
                status: 'success',
                message: 'Review created',
                data: newReview,
                meta: {
                    location: `/api/reviews/${newReview.id}`,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (e) {
            next(e)
        }
    }
}

export default new ReviewsCommandsController();
