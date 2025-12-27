import express from 'express';
import {getAllTours, createTour, getTour, updateTour, deletTour, aliasTopTours, getTourStats, getMonthlyPlan} from '../controllers/tourController'

const router = express.Router()

// router.param('id', checkID)

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deletTour);

export default router;
