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

export { deletOne }
