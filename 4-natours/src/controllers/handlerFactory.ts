import { NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { Model } from "mongoose";
import { AppError } from "../utils/appError";

const deletOne = (Model: Model<any>) => catchAsync(async (req: any, res: any, next: NextFunction) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
        return next(new AppError('No document found with that ID', 404));
    };
    res.status(204).json({
        status: 'success',
        data: null,
    })
});

const updateOne = (Model: Model<any>) => catchAsync(async (req: any, res: any, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    };
    res.status(201).json({
        status: 'success',
        data: { data: doc }
    });
});

const createOne = (Model: Model<any>) => catchAsync(async (req: any, res: any, next: NextFunction) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        message: 'Document created successfull!',
        data: {
            data: doc
        }
    });
});

export { deletOne, updateOne, createOne }
