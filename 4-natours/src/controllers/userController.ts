import { NextFunction } from 'express';
import multer from 'multer';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { deletOne, getAll, getOne, updateOne } from './handlerFactory';

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/img/users')
    },
    filename: (req: any, file, cb) => {
        // user-userId-currentTimeStamp
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
    }
});

const multerFiler = (req: any, file: Express.Multer.File, cb: any) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFiler
});
const uploadUserPhoto = upload.single('photo');

const filterObj = (obj: Record<string, any>, ...allowedFields: string[]) => {
    const newObj: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
        if (allowedFields.includes(key)) {
            newObj[key] = value;
        }
    });
    return newObj;
}

const getMe = (req: any, res: any, next: NextFunction) => {
    req.params.id = req.user._id;
    next();
}

const updateMe = catchAsync(async (req: any, res: any, next: NextFunction) => {
    console.log('file>>>>>>', req.file);
    console.log('boyd>>>>>>', req.body);
    // 1) Create error if user POSTs password Data
    if(req.body?.password || req.body?.confirmPassword){
        return next(new AppError('This route is not password updates. Please user /updateMyPassword.', 400))
    }
    // 2) Filter unwanted fileds names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    // 3) Update user Document
    const user = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });
    res.status(200).json({
        status: 'success',
        message: 'User data updated successfull!',
        data: {
            user
        }
    })
});

const deleteMe = catchAsync(async (req: any, res: any, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        message: 'User deleted successfull!',
        data: null
    })
})

const createUser = (req: any, res: any) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Please use signup instead.'
    })
}

const getAllUsers = getAll(User);
const getUser = getOne(User);
// Don Not update passwords with this
const updateUser = updateOne(User);
const deleteUser = deletOne(User)

export { getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe, deleteMe, getMe, uploadUserPhoto }
