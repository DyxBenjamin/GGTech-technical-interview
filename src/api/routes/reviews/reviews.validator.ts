import {NextFunction, Request, RequestHandler, Response} from 'express';
import {check, validationResult} from 'express-validator';

class ReviewsValidator {
    validations = {
        create: [
            check('movieId').notEmpty().withMessage('movieId is required'),
            check('movieId').isMongoId().withMessage('movieId is not valid'),
            check('platform').notEmpty().withMessage('Platform is required'),
            check('platform').isMongoId().withMessage('Platform is not valid'),
            check('author').notEmpty().withMessage('Author is required'),
            check('body').notEmpty().withMessage('Body is required'),
            check('score').notEmpty().withMessage('Score is required'),
            check('score').isInt({min: 0, max: 5}).withMessage('Score can only be between 0 and 5'),
        ],
    }

    validate = (type: keyof typeof ReviewsValidator.prototype.validations) : Array<RequestHandler> => {
        return [
            // eslint-disable-next-line security/detect-object-injection
            ...this.validations[type],
            (req: Request, res: Response, next: NextFunction): unknown => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ validationError: errors.array() });
                }
                next();
            }
        ]
    }
}

export default new ReviewsValidator();
