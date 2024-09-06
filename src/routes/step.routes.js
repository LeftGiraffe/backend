import express from "express";

import { getSteps, sendSteps } from "../controllers/step.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getSteps);
router.post("/send", protectRoute, sendSteps);

export default router;