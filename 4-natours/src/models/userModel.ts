import { NextFunction } from "express";
import mongoose, { model, Schema } from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
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
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password '],
        trim: true,
        minlength: [6, 'Confirm password must have more  or equal than 6 chars'],
        // This only works on CREATE SAVE!!!
        validate: {
            validator: function (val: string) {
                return val === this.password;
            },
            message: 'Passwords are not the same!'
        }
    }
}, { timestamps: true });


userSchema.pre('save', async function(){
    // only run this function if password was actually modified
    if(!this.isModified('password')) return;
    // hash the password with cost 12
    this.password = await bcrypt.hash(this.password, 12);
    // delete  confirmPassword failed
    this.confirmPassword = '';
})

const User = model('User', userSchema);

export default User;
