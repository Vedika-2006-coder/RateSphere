import * as userService from "../services/userService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (req, res) => {
  const result = await userService.getUsers(req.query);
  res.status(200).json(result);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserDetails(Number(req.params.id));
  res.status(200).json({ data: user });
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({ data: user, message: "User created." });
});

export const listOwners = asyncHandler(async (_req, res) => {
  res.status(200).json({ data: await userService.getOwnerCandidates() });
});
