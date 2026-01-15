import { NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import Review from "../models/reviewModel";

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
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        data: {
            reviews
        }
    })
})

export { createReview, getAll };
