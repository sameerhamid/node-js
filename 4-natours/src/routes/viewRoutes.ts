import express from "express"
import { getOverview, getTour, login } from "../controllers/viewsController";
import { isLoggedIn } from "../controllers/authController";

const router = express.Router();

router.use(isLoggedIn);
router.get('/', getOverview)
router.get('/tour/:slug', getTour)

router.get('/login', login)

export default router;
