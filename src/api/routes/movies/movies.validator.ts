import {Request, Response, NextFunction, RequestHandler} from 'express';
import { check, validationResult } from 'express-validator';

class MoviesValidator {
    validations = {
        create: [
            check('title').notEmpty().withMessage('Title is required'),
            check('director').notEmpty().withMessage('Director is required'),
            check('image').notEmpty().withMessage('Image is required'),
        ],
        get: [
            check('id').notEmpty().withMessage('Movie ID is required'),
            check('id').isMongoId().withMessage('Movie ID is not valid')
        ],
        update: [
            check('id').notEmpty().withMessage('Movie ID is required'),
            check('id').isMongoId().withMessage('Movie ID is not valid'),
            check('title').notEmpty().withMessage('Title is required'),
            check('director').notEmpty().withMessage('Director is required'),
            check('image').notEmpty().withMessage('Image is required'),
            check('score').notEmpty().withMessage('Score is required'),
            check('platforms').notEmpty().withMessage('Platforms is required'),
            check('reviews').notEmpty().withMessage('Reviews is required')
        ],
        delete: [
            check('id').notEmpty().withMessage('Movie ID is required'),
            check('id').isMongoId().withMessage('Movie ID is not valid')
        ],
    }

    validate = (type: keyof typeof MoviesValidator.prototype.validations) : Array<RequestHandler> => {
        return [
            // eslint-disable-next-line security/detect-object-injection
            ...this.validations[type],
            (req: Request, res: Response, next: NextFunction): unknown => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                next();
            }
        ]
    }
}

export default new MoviesValidator();
