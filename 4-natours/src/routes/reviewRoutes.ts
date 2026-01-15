import express from 'express';
import { restrictTo, verfiyToken } from '../controllers/authController';
import { createReview, deletReview, getAll } from '../controllers/reviewController';
import { EUserRole } from '../models/userModel';

const router = express.Router({ mergeParams: true });

router.route('/').get(getAll).post(verfiyToken, restrictTo([EUserRole.USER]), createReview);

router.route('/:id').delete(verfiyToken, restrictTo([EUserRole.USER]), deletReview);

export default router;
