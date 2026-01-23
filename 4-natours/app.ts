import path from 'path';
import express from 'express';
import morgan from 'morgan';
import reateLimit from 'express-rate-limit';
import helmet from 'helmet';
import monogSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { xss } from 'express-xss-sanitizer';
import tourRouter from './src/routes/tourRoutes'
import userRouter from './src/routes/userRoutes'
import reviewRouter from './src/routes/reviewRoutes'
import viewRoutes from './src/routes/viewRoutes'
import { AppError } from './src/utils/appError';
import globalErrorController from './src/controllers/errorController';

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
app.set('query parser', 'extended');
// 1) -------------- MIDDLEWARES ----------

// Set Security http headers
// app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://127.0.0.1:3000"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  })
);


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
app.use(express.urlencoded({ extended: true, limit: '10kb'}));
app.use(cookieParser());

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


// Test middleware
app.use((req: any, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
})

// 3) -------------- ROUTES ----------

app.use('/', viewRoutes);
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
