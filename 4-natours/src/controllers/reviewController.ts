import { NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import Review from "../models/reviewModel";
import { createOne, deletOne, updateOne } from "./handlerFactory";


const setTourAndUserIds = (req: any, res: any, next: NextFunction) => {
    if (!req.body.tour) {
        req.body.tour = req.params.tourId
    }
    if (!req.body.user) {
        req.body.user = req.user._id;
    }
    next();
}


const getAll = catchAsync(async (req: any, res: any, next: NextFunction) => {
    let filter = {}
    if (req.params.tourId) {
        filter = { tour: req.params.tourId }
    }
    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        data: {
            reviews
        }
    })
})

const createReview = createOne(Review);
const updateReview = updateOne(Review);
const deletReview = deletOne(Review);

export { createReview, getAll, deletReview, updateReview, setTourAndUserIds };
