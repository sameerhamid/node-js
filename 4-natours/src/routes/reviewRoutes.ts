import express from 'express';
import { restrictTo, verfiyToken } from '../controllers/authController';
import { createReview, deletReview, getAll, updateReview } from '../controllers/reviewController';
import { EUserRole } from '../models/userModel';

const router = express.Router({ mergeParams: true });

router.route('/').get(getAll).post(verfiyToken, restrictTo([EUserRole.USER]), createReview);

router.route('/:id').patch(verfiyToken, restrictTo([EUserRole.USER]), updateReview).delete(verfiyToken, restrictTo([EUserRole.USER]), deletReview);

export default router;
