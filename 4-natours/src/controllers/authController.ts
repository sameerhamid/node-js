import { promisify } from 'util'
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
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: req.body.passwordChangedAt
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

interface TokenPayload {
    userId: string;
    iat: number;
    exp: number;
}

const verfiyToken = catchAsync(async (req: any, res: any, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token;
    if(req?.headers?.authorization && req.headers.authorization.startsWith('Bearer') ){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('You are not logged in! Please login to get access.', 401));
    }
    // 2) Verfication token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    // 3) Check if user still exists
    const user = await User.findById(decoded.userId);
    if(!user){
        return next(new AppError('The user belonging to this token does no longer exits.', 401));
    }
    // 4) Check if user changed password after token was issued
    if(user.changePasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please login agian.', 401));
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = user
    next();
})

export { signUp, login, verfiyToken };
