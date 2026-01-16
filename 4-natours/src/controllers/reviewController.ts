import { NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import Review from "../models/reviewModel";
import { deletOne, updateOne } from "./handlerFactory";

const createReview = catchAsync(async (req: any, res: any, next: NextFunction) => {
    // Allow nested routes
    if(!req.body.tour){
        req.body.tour = req.params.tourId
    }
    if(!req.body.user){
        req.body.user = req.user._id;
    }
    const review = await Review.create({
        review: req.body?.review ?? "",
        rating: req.body?.rating ?? "",
        tour: req.body?.tour ?? "",
        user: req.body.user ?? ""
    });
    res.status(201).json({
        status: 'success',
        message: 'Reveiw created successfull!',
        data: {
            review
        }
    })
 });

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

const updateReview = updateOne(Review);
const deletReview = deletOne(Review);

export { createReview, getAll, deletReview, updateReview };
