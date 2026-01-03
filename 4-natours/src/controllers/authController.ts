import { NextFunction } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";


const signUp = catchAsync(async (req: any, res: any, next: NextFunction) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    })
});


export { signUp };
