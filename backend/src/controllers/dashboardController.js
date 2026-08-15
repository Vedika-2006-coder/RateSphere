import * as dashboardService from "../services/dashboardService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const userDashboard = asyncHandler(async (req, res) => {
  res.status(200).json({ data: await dashboardService.getUserDashboard(req.user) });
});

export const ownerDashboard = asyncHandler(async (req, res) => {
  res.status(200).json({ data: await dashboardService.getOwnerDashboard(req.user) });
});

export const adminDashboard = asyncHandler(async (_req, res) => {
  res.status(200).json({ data: await dashboardService.getAdminDashboard() });
});
