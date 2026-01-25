import express from "express"
import { getAccount, getMyTours, getOverview, getTour, login, updateUserData } from "../controllers/viewsController";
import { isLoggedIn, verfiyToken } from "../controllers/authController";
import { createBookingCheckout } from "../controllers/bookingController";

const router = express.Router();

router.get('/me', verfiyToken, getAccount)
router.use(isLoggedIn);
router.get('/', createBookingCheckout, getOverview)
router.get('/tour/:slug', getTour)
router.get('/login', login)
router.get('/my-tours',verfiyToken, getMyTours)

router.post('/submit-user-data', updateUserData)

export default router;
