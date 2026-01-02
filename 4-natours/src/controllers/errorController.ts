import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { CastError } from 'mongoose';



const handleCastErrorDB = (err: CastError)=>{
    const message = `Invalid ${err.path}: ${err.value}`;
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

const sendErrorForProd = (err: AppError, res: Response) => {
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

const errorController = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'
    if (process.env.NODE_ENV === 'development') {
        sendErrorForDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err};
        if(error.name === 'CastError') {
            error = handleCastErrorDB(error as any)
        }
        sendErrorForProd(error, res);
        next();
    }
}

export default errorController;
