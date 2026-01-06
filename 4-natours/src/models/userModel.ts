import { NextFunction } from "express";
import mongoose, { model, Schema,  Document, HydratedDocument} from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    photo?: string;
    correctPassword(
        candidatePassword: string,
        userPassword: string
    ): Promise<boolean>;
    passwordChangedAt?: Date;
    changePasswordAfter(JWTTimeStamp: number): boolean
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        trim: true,
        maxlength: [20, 'Name must have less or equal than 20 chars'],
        minlength: [3, 'Name must have more  or equal than 3 chars'],
    },
    email: {
        type: String,
        required: [true, 'Please Provide your email'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        trim: true,
        minlength: [6, 'A password must have more  or equal than 6 chars'],
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password '],
        trim: true,
        select: false,
        minlength: [6, 'Confirm password must have more  or equal than 6 chars'],
        // This only works on CREATE SAVE!!!
        validator: function (this: HydratedDocument<IUser>, val: string) {
            return val === this.password;
        },
        message: 'Passwords are not the same!',
    },
    passwordChangedAt: Date
}, { timestamps: true });


userSchema.pre('save', async function () {
    // only run this function if password was actually modified
    if (!this.isModified('password')) return;
    // hash the password with cost 12
    this.password = await bcrypt.hash(this.password, 12);
    // delete  confirmPassword failed
    this.confirmPassword = '';
})

userSchema.methods.correctPassword = async function (candidatePass: string, userPass: string) {
    return await bcrypt.compare(candidatePass, userPass);
};

userSchema.methods.changePasswordAfter = function (JWTTimeStamp: number) {
    if (this.passwordChangedAt) {
        return Boolean((this.passwordChangedAt.getTime()) > (JWTTimeStamp * 1000))
    }
    // FASLE means NOT chnaged
    return false;
}

const User = model('User', userSchema);

export default User;
