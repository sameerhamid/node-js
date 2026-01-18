import express from 'express';
import { restrictTo, verfiyToken } from '../controllers/authController';
import { createReview, deletReview, getAllReview, getReivew, setTourAndUserIds, updateReview } from '../controllers/reviewController';
import { EUserRole } from '../models/userModel';

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllReview).post(verfiyToken, restrictTo([EUserRole.USER]), setTourAndUserIds, createReview);

router.route('/:id').get(verfiyToken, getReivew).patch(verfiyToken, restrictTo([EUserRole.USER]), updateReview).delete(verfiyToken, restrictTo([EUserRole.USER]), deletReview);

export default router;
