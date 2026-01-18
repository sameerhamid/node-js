import { NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { Model } from "mongoose";
import { AppError } from "../utils/appError";
import APIFreatures from "../utils/apiFeatures";

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

const getOne = (Model: Model<any>, populateOpts?: any) => catchAsync(async (req: any, res: any, next: NextFunction) => {
    const query = Model.findById(req.params.id);
    if(populateOpts){
        query.populate(populateOpts);
    }
    const doc = await query;
    if(!doc){
        return next(new AppError('No document found with that ID', 404));
    };
    res.status(200).json({
        status: 'success',
        data: { data: doc },
    })
});

const getAll = (Model: Model<any>) => catchAsync(async (req: any, res: any,) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {}
    if (req.params.tourId) {
        filter = { tour: req.params.tourId }
    }
    //---------------- EXICUTE THE QUERY
    const features = new APIFreatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();
    const doc = await features.query;

    // --------------- SEND RESPONSE
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: doc?.length ?? 0,
        data: { data: doc },
    })
});

export { deletOne, updateOne, createOne, getOne, getAll }
