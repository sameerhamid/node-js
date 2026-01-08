import express from 'express';
import {getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe} from '../controllers/userController';
import { forgotPassword, login, resetPassword, signUp, updatePassword, verfiyToken } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login)

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', verfiyToken, updatePassword);
router.patch('/updateMe', verfiyToken, updateMe)

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);


export default router;
