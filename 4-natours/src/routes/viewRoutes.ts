import express from "express"
import { getAccount, getOverview, getTour, login, updateUserData } from "../controllers/viewsController";
import { isLoggedIn, verfiyToken } from "../controllers/authController";

const router = express.Router();

router.get('/me', verfiyToken, getAccount)
router.use(isLoggedIn);
router.get('/', getOverview)
router.get('/tour/:slug', getTour)
router.get('/login', login)

router.post('/submit-user-data', updateUserData)

export default router;
