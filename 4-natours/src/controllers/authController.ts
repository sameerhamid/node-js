import jwt from 'jsonwebtoken'
import { NextFunction } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import { AppError } from '../utils/appError';


const singnToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '90d',
    });
}

const signUp = catchAsync(async (req: any, res: any, next: NextFunction) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    const token = singnToken(newUser._id.toString());
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});


const login = catchAsync(async (req: any, res: any, next: NextFunction) => {
    const { email, password } = req.body;
    // 1) Check if email and password exits
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exits and password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user?.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    // 3) If everthing is ok, send token to client
    const token = singnToken(user._id.toString());
    res.status(200).json({
        status: 'success',
        token,
    })
})

export { signUp, login };
