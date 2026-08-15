import * as ratingService from "../services/ratingService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitRating = asyncHandler(async (req, res) => {
  const result = await ratingService.submitRating(
    req.user.id,
    Number(req.params.storeId),
    req.body.rating,
  );
  res.status(201).json({ data: result, message: "Rating submitted." });
});

export const updateRating = asyncHandler(async (req, res) => {
  const result = await ratingService.modifyRating(
    req.user.id,
    Number(req.params.storeId),
    req.body.rating,
  );
  res.status(200).json({ data: result, message: "Rating updated." });
});

export const listStoreRatings = asyncHandler(async (req, res) => {
  const data = await ratingService.getStoreRatings(Number(req.params.storeId), req.user);
  res.status(200).json({ data });
});

export const listMyRatings = asyncHandler(async (req, res) => {
  res.status(200).json({ data: await ratingService.getUserRatings(req.user.id) });
});
