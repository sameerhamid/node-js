import express from 'express';
import morgan from 'morgan';
import reateLimit from 'express-rate-limit';
import helmet from 'helmet';
import monogSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { xss } from 'express-xss-sanitizer';
import tourRouter from './src/routes/tourRoutes'
import userRouter from './src/routes/userRoutes'
import reviewRouter from './src/routes/reviewRoutes'
import { AppError } from './src/utils/appError';
import globalErrorController from './src/controllers/errorController';

const app = express();
const PORT = 3000;
app.set('query parser', 'extended');
// 1) -------------- MIDDLEWARES ----------

// Set Security http headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = reateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour',
});

app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSql query injection
// app.use(monogSanitize({ replaceWith: '_', onSanitize: ({ key }) => { }, allowDots: true }));

app.use((req, res, next) => {
    if (req.body) {
        monogSanitize.sanitize(req.body);
    }
    next();
})

// Date sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['ratingsAverage', 'ratingsQuanitity', 'duration', 'maxGroupSize', 'difficulty', 'price']
}));

// Serving static files
app.use(express.static(`${__dirname}/public`));


// Test middleware
app.use((req: any, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// 3) -------------- ROUTES ----------

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use((req, res, next)=>{
    // res.status(404).json({
    //     status: 'failed',
    //     message: `Can't find ${req.originalUrl} on this server!`
    // })
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 400));
});

app.use(globalErrorController);

export default app;
