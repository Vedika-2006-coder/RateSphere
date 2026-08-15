import { findStoresByOwner } from "../repositories/storeRepository.js";
import {
  findUserByEmail,
  findUserById,
  insertUser,
  listOwnerCandidates,
  listUsers,
} from "../repositories/userRepository.js";
import { conflict, notFound } from "../utils/httpError.js";
import { hashPassword } from "../utils/password.js";

export function getUsers(params) {
  return listUsers(params);
}

export async function getUserDetails(id) {
  const user = await findUserById(id);
  if (!user) throw notFound("User not found.");

  // Store owners additionally expose their store rating information.
  const stores = user.role === "store_owner" ? await findStoresByOwner(id) : [];
  return { ...user, stores };
}

export async function createUser({ name, email, address, password, role }) {
  const existing = await findUserByEmail(email);
  if (existing) throw conflict("An account with that email already exists.");

  const passwordHash = await hashPassword(password);
  return insertUser({ name, email, address, passwordHash, role });
}

export function getOwnerCandidates() {
  return listOwnerCandidates();
}
