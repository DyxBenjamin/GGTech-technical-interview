import {Router} from "express";
import commands from "@api/routes/reviews/reviews.commands";

const reviewsRouter = Router()

reviewsRouter.post('/', commands.create)

export default reviewsRouter
