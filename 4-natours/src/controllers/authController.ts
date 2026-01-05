import jwt from 'jsonwebtoken'
import { NextFunction } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";


const signUp = catchAsync(async (req: any, res: any, next: NextFunction) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET!, {
        expiresIn: '90d',
    });

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});


export { signUp };
