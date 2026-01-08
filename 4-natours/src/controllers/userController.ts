import { NextFunction } from 'express';
import {users} from '../../dev-data'
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/appError';

const filterObj = (obj: Record<string, any>, ...allowedFields: string[]) => {
    const newObj: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
        if (allowedFields.includes(key)) {
            newObj[key] = value;
        }
    });
    return newObj;
}

const getAllUsers = catchAsync(async (req: any, res: any) => {
    const users = await User.find();
    // --------------- SEND RESPONSE
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: users?.length ?? 0,
        data: { users },
    })
})

const updateMe = catchAsync(async (req: any, res: any, next: NextFunction) => {
    // 1) Create error if user POSTs password Data
    if(req.body?.password || req.body?.confirmPassword){
        return next(new AppError('This route is not password updates. Please user /updateMyPassword.', 400))
    }
    // 2) Filter unwanted fileds names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    // 3) Update user Document
    const user = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });
    res.status(200).json({
        status: 'success',
        message: 'User data updated successfull!',
        data: {
            user
        }
    })
});

const createUser = (req: any, res: any) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const getUser = (req: any, res: any) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const updateUser = (req: any, res: any) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const deleteUser = (req: any, res: any) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}


export {getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe}
