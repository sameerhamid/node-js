import mongoose, { model, Schema } from "mongoose";
import validator from 'validator'

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        unique: true,
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
        minlength: [8, 'A password must have more  or equal than 3 chars'],
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password '],
        trim: true,
        minlength: [6, 'A password must have more  or equal than 3 chars'],
        validate: {
            validator: function (val: string) {
                return val !== this.password;
            },
            message: 'Password and confirm password do not match!'
        }
    }
}, { timestamps: true });


const User = model('User', userSchema);

export default User;
