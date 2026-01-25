import express from 'express';
import { restrictTo, verfiyToken } from '../controllers/authController';
import { createBooking, deleteBooking, getAllBookings, getBooking, getCheckoutSession, updateBooking } from '../controllers/bookingController';
import { EUserRole } from '../models/userModel';

const router = express.Router({ mergeParams: true });

router.use(verfiyToken);
router.get('/checkout-session/:tourId', getCheckoutSession);
router.use(restrictTo([EUserRole.ADMIN, EUserRole.LEAD_GUIDE]));
router.route('/').get(getAllBookings).post(createBooking);
router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;
