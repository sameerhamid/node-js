import express from 'express';
import {getAllTours, createTour, getTour, updateTour, deletTour, aliasTopTours, getTourStats, getMonthlyPlan} from '../controllers/tourController'
import { restrictTo, verfiyToken } from '../controllers/authController';
import { EUserRole } from '../models/userModel';
import { createReview } from '../controllers/reviewController';
import reviewRouter from './reviewRoutes'

const router = express.Router()

router.use(verfiyToken);
router.use('/:tourId/reviews', reviewRouter)

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(restrictTo([EUserRole.ADMIN, EUserRole.LEAD_GUIDE]), deletTour);


export default router;
