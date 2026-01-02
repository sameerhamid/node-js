import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { CastError } from 'mongoose';

const handleCastErrorDB = (err: CastError) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = (err: any) => {
    const message = `Duplicate field value: x. Please use another value!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = (err: any) => {
    const message = `Invalid input data ${err.message}`;
    return new AppError(message, 400);
}

const sendErrorForDev = (err: AppError, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorForProd = (err: any, res: Response) => {
    // OPERATION ERROR, trusted errror: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });

    // PROGRAMING OR OTHER UNKNOWN ERRROR: don't want to leak error details
    } else {
        // 1. LOG ERROR
        console.error('ERROR 🔥', err);

        // 2. SEND GENERIC MESSAGE
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        })
    }
}

const errorController = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorForDev(err, res);
    }

    if (process.env.NODE_ENV === 'production') {
        let error = {...err};

        error.message = err.message;
        error.name = err.name;

        if (error.name === 'CastError') {
            error = handleCastErrorDB(error);
        }

        if (error.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }

        if (error.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        }
        sendErrorForProd(error, res);
    }
};


export default errorController;
