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

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    })
});


export { signUp };
