import { Router } from "express";
import rateLimit from "express-rate-limit";

import * as authController from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { changePasswordSchema, loginSchema, registerSchema } from "../validators/schemas.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMITED", message: "Too many attempts. Try again later." } },
});

router.post("/register", authLimiter, validateBody(registerSchema), authController.register);
router.post("/login", authLimiter, validateBody(loginSchema), authController.login);
router.get("/me", authenticate, authController.me);
router.patch(
  "/password",
  authenticate,
  validateBody(changePasswordSchema),
  authController.changePassword,
);

export default router;
