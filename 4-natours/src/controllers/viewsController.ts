import { NextFunction } from "express";
import Tour from "../models/tourModel";
import { AppError } from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";

const getOverview = catchAsync(async (req: any, res: any) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();

    // 2) Build template
    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
})

const getTour = catchAsync(async (req: any, res: any, next: NextFunction) => {
    const slug = req.params.slug;
    // 1) Get the data, for requested tour (including reiviews and guides)
    const tour =  await Tour.findOne({ slug }).populate({
        path: 'reviews',
        select: 'review rating user',
    });

    if(!tour){
        return next(new AppError('There is no tour with that name', 404));
    }

    // 2) Build template
    // 3) Render template using step 1)
    res.status(200).render('tour', {
        title: `${tour?.name ?? ""} Tour`,
        tour
    });
})

const login = catchAsync(async (req: any, res: any) => {
    res.status(200).render('login', {
        title: 'Login into your account',
    });
})

const getAccount = catchAsync(async (req: any, res: any) =>{
    res.status(200).render('account', {
        title: 'Your account details'
    })
})

const updateUserData = catchAsync(async (req: any, res: any) => {
    const user = await User.findOneAndUpdate(req.body.id, {
        name: req.body.name,
        email: req.body.email,
    }, {
        new: true,
        runValidators: true
    });
    res.status(200).render('account', {
        title: 'Your account',
        user
    });
})

export { getOverview, getTour, login, getAccount, updateUserData }
