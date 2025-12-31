import fs from 'fs';
import express from 'express';
import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';
import tourRouter from './src/routes/tourRoutes'
import userRouter from './src/routes/userRoutes'
import { AppError } from './src/utils/appError';
import globalErrorController from './src/controllers/errorController';

const app = express();
const PORT = 3000;
app.set('query parser', 'extended');
// 1) -------------- MIDDLEWARES ----------

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));


app.use((req: any, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// 3) -------------- ROUTES ----------

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use((req, res, next)=>{
    // res.status(404).json({
    //     status: 'failed',
    //     message: `Can't find ${req.originalUrl} on this server!`
    // })
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 400));
});

app.use(globalErrorController);

export default app;
