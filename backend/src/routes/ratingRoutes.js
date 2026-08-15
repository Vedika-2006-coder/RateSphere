import { Router } from "express";

import * as ratingController from "../controllers/ratingController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { ratingSchema } from "../validators/schemas.js";

const router = Router();

router.post(
  "/:storeId/ratings",
  authenticate,
  authorize("normal_user"),
  validateBody(ratingSchema),
  ratingController.submitRating,
);

router.put(
  "/:storeId/ratings",
  authenticate,
  authorize("normal_user"),
  validateBody(ratingSchema),
  ratingController.updateRating,
);

// Ownership / role scoping is applied inside the service layer.
router.get("/:storeId/ratings", authenticate, ratingController.listStoreRatings);

export default router;
