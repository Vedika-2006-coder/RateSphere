import { Router } from "express";

import authRoutes from "./authRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import ratingRoutes from "./ratingRoutes.js";
import storeRoutes from "./storeRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok", service: "ratesphere-api" }));

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/stores", storeRoutes);
router.use("/stores", ratingRoutes);
router.use("/", dashboardRoutes);

export default router;
