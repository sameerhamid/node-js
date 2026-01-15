import express from 'express';
import {getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe, deleteMe} from '../controllers/userController';
import { forgotPassword, login, resetPassword, restrictTo, signUp, updatePassword, verfiyToken } from '../controllers/authController';
import { EUserRole } from '../models/userModel';


const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login)

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', verfiyToken, updatePassword);
router.patch('/updateMe', verfiyToken, updateMe);
router.delete ('/deleteMe', verfiyToken,  deleteMe)

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(verfiyToken, restrictTo([EUserRole.ADMIN]), deleteUser);


export default router;
