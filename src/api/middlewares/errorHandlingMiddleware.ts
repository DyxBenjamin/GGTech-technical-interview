import {ErrorDetails} from "@api/middlewares/ErrorDetails";
import {Response} from "express";

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

const errorHandlingMiddleware = (err: unknown, res: Response): Response => {
    if (err instanceof ServerError) {
        return res.status(err.statusCode).json({
            status: 'error',
            code: err.errorCode,
            message: err.message,
            solution: err.solution
        });
    }

    // Other especific handler for other kind of errors
    // ...

    // eslint-disable-next-line no-console
    console.error('Server Error:', err);
    const genericError = new ServerError('INTERNAL_ERROR');
    return res.status(genericError.statusCode).json({
        status: 'error',
        code: genericError.errorCode,
        message: genericError.message,
        solution: genericError.solution
    });
}

export { ServerError, errorHandlingMiddleware };
