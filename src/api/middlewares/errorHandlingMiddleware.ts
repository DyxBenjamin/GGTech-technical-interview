import {ErrorDetails} from "@api/middlewares/ErrorDetails";
import {NextFunction, Request, Response} from "express";

class ServerError extends Error {
    type: keyof typeof ErrorDetails;

    constructor(type: keyof typeof ErrorDetails) {
        // eslint-disable-next-line security/detect-object-injection
        super(ErrorDetails[type].message);
        this.type = type;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ServerError);
        }
    }

    get statusCode(): number {
        return ErrorDetails[this.type].statusCode;
    }
    get errorCode(): number {
        return ErrorDetails[this.type].code;
    }
    get solution(): string {
        return ErrorDetails[this.type].solution;
    }
}

const errorHandlingMiddleware = (err: ServerError, req: Request , res: Response, next: NextFunction): void => {
    if (res.headersSent) {
        return next(err);
    }
    // eslint-disable-next-line no-console
    const message = err.message || 'Internal Server Error';
    if (err instanceof ServerError) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            help: err.solution,
            meta:{
                timestamp: new Date().toISOString()
            }
        });
        return;
    }

    const genericError = new ServerError('INTERNAL_ERROR');
    res.status(genericError.statusCode).json({
        status: 'error',
        message,
        help: genericError.solution,
        meta:{
            timestamp: new Date().toISOString()
        }
    });
}

export { ServerError, errorHandlingMiddleware };
