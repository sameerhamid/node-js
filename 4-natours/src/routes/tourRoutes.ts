import express from 'express';
import {getAllTours, createTour, getTour, updateTour, deletTour, aliasTopTours, getTourStats, getMonthlyPlan, getToursWithin, getDistances} from '../controllers/tourController'
import { restrictTo, verfiyToken } from '../controllers/authController';
import { EUserRole } from '../models/userModel';
import reviewRouter from './reviewRoutes'

const router = express.Router()

router.use('/:tourId/reviews', reviewRouter)
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/stats').get(getTourStats);
router.route('/monthly-plan/:year').get(restrictTo([EUserRole.ADMIN, EUserRole.LEAD_GUIDE, EUserRole.GUIDE]), getMonthlyPlan);
router.get('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin);
router.get('/distances/:latlng/unit/:unit', getDistances);

router.route('/').get(getAllTours).post(verfiyToken, restrictTo([EUserRole.ADMIN, EUserRole.LEAD_GUIDE]), createTour);
router.route('/:id').get(getTour).patch(verfiyToken, restrictTo([EUserRole.ADMIN, EUserRole.LEAD_GUIDE]), updateTour).delete(restrictTo([EUserRole.ADMIN, EUserRole.LEAD_GUIDE]), deletTour);


export default router;
