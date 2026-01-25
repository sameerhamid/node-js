import express from 'express';
import { verfiyToken } from '../controllers/authController';
import { getCheckoutSession } from '../controllers/bookingController';

const router = express.Router({ mergeParams: true });

router.use(verfiyToken);
router.get('/checkout-session/:tourId', getCheckoutSession)

export default router;
