import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';


const errorController = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
    next();
}

export default errorController
