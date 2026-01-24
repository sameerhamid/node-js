import express from 'express';
import multer from 'multer';
import {getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe, deleteMe, getMe, uploadUserPhoto, resizeUserPhoto} from '../controllers/userController';
import { forgotPassword, login, logout, resetPassword, restrictTo, signUp, updatePassword, verfiyToken } from '../controllers/authController';
import { EUserRole } from '../models/userModel';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login)
router.get('/logout', logout)

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protects all routes after this middleware
router.use(verfiyToken);
router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe', deleteMe)

router.use(restrictTo([EUserRole.ADMIN]));
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);


export default router;
