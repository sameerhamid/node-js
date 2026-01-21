import express from "express"
import { getOverview, getTour, login } from "../controllers/viewsController";

const router = express.Router();

router.get('/', getOverview)
router.get('/tour/:slug', getTour)

router.get('/login', login)

export default router;
