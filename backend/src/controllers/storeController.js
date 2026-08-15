import * as storeService from "../services/storeService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listStores = asyncHandler(async (req, res) => {
  const viewerId = req.user?.role === "normal_user" ? req.user.id : null;
  res.status(200).json(await storeService.getStores(req.query, viewerId));
});

export const getStore = asyncHandler(async (req, res) => {
  const viewerId = req.user?.role === "normal_user" ? req.user.id : null;
  res.status(200).json({ data: await storeService.getStore(Number(req.params.id), viewerId) });
});

export const createStore = asyncHandler(async (req, res) => {
  const store = await storeService.createStore(req.body);
  res.status(201).json({ data: store, message: "Store created." });
});
