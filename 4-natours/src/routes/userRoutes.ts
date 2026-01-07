import express from 'express';
import {getAllUsers, createUser, getUser, updateUser, deleteUser} from '../controllers/userController';
import { forgotPassword, login, signUp } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login)

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', forgotPassword);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);


export default router;
