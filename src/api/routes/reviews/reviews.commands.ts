import ReviewServices from "@core/services/review.services";
import {Request, Response} from "express";

class ReviewsCommandsController {
    async create(req: Request, res: Response): Promise<void> {
        const reviewData = req.body;
        const newReview = await ReviewServices.createReview(reviewData);
        res.status(201).json({
            status: 'success',
            message: 'Review created',
            data: newReview,
            meta: {
                location: `/api/reviews/${newReview.id}`,
                timestamp: new Date().toISOString()
            }
        });
    }
}

export default new ReviewsCommandsController();
