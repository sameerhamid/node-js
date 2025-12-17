import express from 'express';
import {getAllTours, createTour, getTour, updateTour, deletTour, checkID, checkBody} from '../controllers/tourController'

const router = express.Router()

router.param('id', checkID)

router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deletTour);

export default router;
