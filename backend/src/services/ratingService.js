import {
  findRating,
  insertRating,
  listStoreRatings,
  listUserRatings,
  updateRating,
} from "../repositories/ratingRepository.js";
import { findStoreById, findStoreOwnerId } from "../repositories/storeRepository.js";
import { conflict, forbidden, notFound } from "../utils/httpError.js";

async function assertStoreExists(storeId) {
  const store = await findStoreById(storeId);
  if (!store) throw notFound("Store not found.");
  return store;
}

/** Creates a rating. Duplicates are blocked here AND by UNIQUE(user_id, store_id). */
export async function submitRating(userId, storeId, rating) {
  await assertStoreExists(storeId);
  const existing = await findRating(userId, storeId);
  if (existing) {
    throw conflict("You have already rated this store. Update your existing rating instead.");
  }
  const created = await insertRating(userId, storeId, rating);
  return { rating: created, store: await findStoreById(storeId, userId) };
}

/** Updates the caller's own rating only — user_id comes from the token, never the body. */
export async function modifyRating(userId, storeId, rating) {
  await assertStoreExists(storeId);
  const existing = await findRating(userId, storeId);
  if (!existing) throw notFound("You have not rated this store yet.");

  const updated = await updateRating(userId, storeId, rating);
  return { rating: updated, store: await findStoreById(storeId, userId) };
}

/**
 * Ratings for one store. Administrators see any store; store owners only their
 * own stores; normal users only their own rating.
 */
export async function getStoreRatings(storeId, viewer) {
  const store = await findStoreOwnerId(storeId);
  if (!store) throw notFound("Store not found.");

  if (viewer.role === "store_owner" && store.owner_id !== viewer.id) {
    throw forbidden("You can only view ratings for your own stores.");
  }
  if (viewer.role === "normal_user") {
    const own = await findRating(viewer.id, storeId);
    return own ? [own] : [];
  }
  return listStoreRatings(storeId);
}

export function getUserRatings(userId) {
  return listUserRatings(userId);
}
