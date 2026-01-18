import express from 'express';
import { restrictTo, verfiyToken } from '../controllers/authController';
import { createReview, deletReview, getAllReview, getReivew, setTourAndUserIds, updateReview } from '../controllers/reviewController';
import { EUserRole } from '../models/userModel';

const router = express.Router({ mergeParams: true });

router.use(verfiyToken);
router.route('/').get(getAllReview).post(restrictTo([EUserRole.USER]), setTourAndUserIds, createReview);

router.route('/:id').get(getReivew).patch(restrictTo([EUserRole.USER, EUserRole.ADMIN]), updateReview).delete(restrictTo([EUserRole.USER, EUserRole.ADMIN]), deletReview);

export default router;
