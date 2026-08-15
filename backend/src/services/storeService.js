import {
  findStoreById,
  findStoresByOwner,
  insertStore,
  listStores,
} from "../repositories/storeRepository.js";
import { findUserById } from "../repositories/userRepository.js";
import { badRequest, notFound } from "../utils/httpError.js";

export function getStores(params, viewerId) {
  return listStores(params, viewerId);
}

export async function getStore(id, viewerId) {
  const store = await findStoreById(id, viewerId);
  if (!store) throw notFound("Store not found.");
  return store;
}

export async function createStore(payload) {
  if (payload.ownerId) {
    const owner = await findUserById(payload.ownerId);
    if (!owner) throw badRequest("The selected owner does not exist.");
    if (owner.role !== "store_owner") {
      throw badRequest("A store can only be assigned to a user with the Store Owner role.");
    }
  }
  return insertStore(payload);
}

export function getOwnedStores(ownerId) {
  return findStoresByOwner(ownerId);
}
