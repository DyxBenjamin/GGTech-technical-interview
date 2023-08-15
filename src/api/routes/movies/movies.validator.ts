import {NextFunction, Request, RequestHandler, Response} from 'express';
import {check, validationResult} from 'express-validator';

class MoviesValidator {
    validations = {
        create: [
            check('title').notEmpty().withMessage('Title is required'),
            check('overview').notEmpty().withMessage('Overview is required'),
            check('image').notEmpty().withMessage('Image is required'),
            check('image').isURL().withMessage('Image is not valid'),
            check('director').notEmpty().withMessage('Director is required'),
            check('platforms').notEmpty().withMessage('Platforms is required'),
            check('platforms').isArray().withMessage('Platforms is not valid'),
            check('platforms.*.id').isMongoId().withMessage('Platform id is not valid'),
        ],
        get: [
            check('id').notEmpty().withMessage('Movie ID is required'),
            check('id').isMongoId().withMessage('Movie ID is not valid')
        ],
        update: [
            check('id').notEmpty().withMessage('Movie ID is required'),
            check('id').isMongoId().withMessage('Movie ID is not valid'),
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
                    return res.status(400).json({ validationError: errors.array() });
                }
                next();
            }
        ]
    }
}

export default new MoviesValidator();
