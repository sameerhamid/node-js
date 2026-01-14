import express from 'express';
import { verfiyToken } from '../controllers/authController';
import { createReview, getAll } from '../controllers/reviewController';

const router = express.Router();

router.route('/').get(getAll).post(verfiyToken, createReview);

export default router;
