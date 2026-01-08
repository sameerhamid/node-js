import jwt from 'jsonwebtoken'
import crypto from 'crypto';
import { NextFunction } from "express";
import User, { EUserRole } from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import { AppError } from '../utils/appError';
import sendEamail from '../utils/email';


const singnToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '90d',
    });
}

const createSendToken = (userId: string, statusCode: number, res: any) => {
    const token = singnToken(userId);
    res.status(statusCode).json({
        status: 'success',
        token,
    })
}

const signUp = catchAsync(async (req: any, res: any, next: NextFunction) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });
    createSendToken(newUser._id.toString(), 201, res);
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
    createSendToken(user._id.toString(), 200, res);
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

const restrictTo = (roles: EUserRole[]) =>{
    return (req: any, res: any, next: NextFunction) =>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('You don not have to permission to perform this action ', 403));
        }
        next();
    }
}

const forgotPassword = catchAsync(async (req: any, res: any, next: NextFunction) => {
    // 1) Get user base on Posted email
    const user = await User.findOne({ email: req.body.email });
    if(!user){
        return next(new AppError('There is no user with email address.', 404));
    }
    // 2) Generate the random reset token
    const token = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to users email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${token}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you did not forget your password, please ignore this email`
    try {
        await sendEamail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            text: message
        })
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        })
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error sending the email. Try agian later!', 500));
    }
});

const resetPassword = catchAsync(async (req: any, res: any, next: NextFunction) => {
    // 1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {
        $gte: Date.now()
    }});
    // 2) If token has not expired, and there is user, set the new password
    if(!user){
        return next(new AppError('Token is invalid or expired', 400));
    }
    // 3) Update passwordChangedAt property for the user
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // 4) Log user in, send token
    createSendToken(user._id.toString(), 200, res);
});

const updatePassword = catchAsync(async (req: any, res: any, next: NextFunction) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
        return next(new AppError('User not found', 401));
    }
    if(!req.body?.currentPassword){
        return next(new AppError('Please enter currentPassword', 400));
    }
    // 2) Check if POSTed current password is correct
    if (!(await user?.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Your current password is wrong', 401));
    }
    // 3) If so, update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    // 4) Log User in, send token
    const token = singnToken(user.id);
    createSendToken(user.id, 200, res);
})

export { signUp, login, verfiyToken ,restrictTo, forgotPassword, resetPassword, updatePassword };
