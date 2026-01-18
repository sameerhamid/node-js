import { NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import Review from "../models/reviewModel";
import { createOne, deletOne, getAll, getOne, updateOne } from "./handlerFactory";


const setTourAndUserIds = (req: any, res: any, next: NextFunction) => {
    if (!req.body.tour) {
        req.body.tour = req.params.tourId
    }
    if (!req.body.user) {
        req.body.user = req.user._id;
    }
    next();
}


const getAllReview = getAll(Review);
const getReivew = getOne(Review);
const createReview = createOne(Review);
const updateReview = updateOne(Review);
const deletReview = deletOne(Review);

export { createReview, getAllReview, deletReview, updateReview, setTourAndUserIds, getReivew };
