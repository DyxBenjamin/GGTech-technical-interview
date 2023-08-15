import {Router} from "express";
import commands from "@api/routes/reviews/reviews.commands";
import ReviewsValidator from "@api/routes/reviews/reviews.validator";

const reviewsRouter = Router()

reviewsRouter.post('/movies/:movieId/reviews', ...ReviewsValidator.validate('create'), commands.create)

export default reviewsRouter
