import { Router } from "express";

import * as userController from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createUserSchema } from "../validators/schemas.js";

const router = Router();

// Every user-management endpoint is administrator-only, enforced server-side.
router.use(authenticate, authorize("administrator"));

router.get("/", userController.listUsers);
router.get("/owners", userController.listOwners);
router.get("/:id", userController.getUser);
router.post("/", validateBody(createUserSchema), userController.createUser);

export default router;
