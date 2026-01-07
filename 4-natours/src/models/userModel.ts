import crypto from 'crypto';
import mongoose, { model, Schema,  Document, HydratedDocument} from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs';

export enum EUserRole {
    USER = 'USER',
    GUIDE = 'GUIDE',
    LEAD_GUIDE = 'LEAD_GUIDE',
    ADMIN = 'ADMIN'
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    role: EUserRole;
    photo?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    correctPassword(
        candidatePassword: string,
        userPassword: string
    ): Promise<boolean>;
    passwordChangedAt?: Date;
    changePasswordAfter(JWTTimeStamp: number): boolean;
    createPasswordResetToken: () => void
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
    role: {
        type: String,
        enum: [EUserRole.USER, EUserRole.GUIDE, EUserRole.LEAD_GUIDE, EUserRole.ADMIN],
        default: EUserRole.USER
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
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

userSchema.methods.createPasswordResetToken = function(){
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken =  crypto.createHash('sha256').update(token).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    console.log(this.passwordResetToken, token);
    return token;
}

const User = model('User', userSchema);

export default User;
