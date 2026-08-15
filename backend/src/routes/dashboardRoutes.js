import { Router } from "express";

import * as dashboardController from "../controllers/dashboardController.js";
import * as ratingController from "../controllers/ratingController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.get(
  "/user/dashboard",
  authenticate,
  authorize("normal_user"),
  dashboardController.userDashboard,
);
router.get(
  "/user/ratings",
  authenticate,
  authorize("normal_user"),
  ratingController.listMyRatings,
);
router.get(
  "/owner/dashboard",
  authenticate,
  authorize("store_owner"),
  dashboardController.ownerDashboard,
);
router.get(
  "/admin/dashboard",
  authenticate,
  authorize("administrator"),
  dashboardController.adminDashboard,
);

export default router;
