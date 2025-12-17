import fs from 'fs';
import express from 'express';
import morgan from 'morgan'
import tourRouter from './src/routes/tourRoutes'
import userRouter from './src/routes/userRoutes'

const app = express();
const PORT = 3000;

// 1) -------------- MIDDLEWARES ----------
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    console.log("Hello from the middleware");
    next();
})

app.use((req: any, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// 3) -------------- ROUTES ----------

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


export default app;
