import { Router } from "express";

import * as storeController from "../controllers/storeController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createStoreSchema } from "../validators/schemas.js";

const router = Router();

router.get("/", authenticate, storeController.listStores);
router.get("/:id", authenticate, storeController.getStore);
router.post(
  "/",
  authenticate,
  authorize("administrator"),
  validateBody(createStoreSchema),
  storeController.createStore,
);

export default router;
