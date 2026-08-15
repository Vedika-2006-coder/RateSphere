import {
  findUserByEmail,
  findUserWithHashById,
  insertUser,
  updatePasswordHash,
} from "../repositories/userRepository.js";
import { conflict, unauthorized } from "../utils/httpError.js";
import { signAccessToken } from "../utils/jwt.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

export function toSafeUser(user) {
  if (!user) return null;
  const { password_hash: _ignored, ...safe } = user;
  return safe;
}

/** Public registration always creates a normal_user — the role is never client-supplied. */
export async function register({ name, email, address, password }) {
  const existing = await findUserByEmail(email);
  if (existing) throw conflict("An account with that email already exists.");

  const passwordHash = await hashPassword(password);
  const user = await insertUser({ name, email, address, passwordHash, role: "normal_user" });
  return toSafeUser(user);
}

export async function login({ email, password }) {
  const user = await findUserByEmail(email);
  // Same generic message for unknown email and wrong password (no account enumeration).
  const invalid = unauthorized("Incorrect email or password.");
  if (!user) throw invalid;

  const matches = await verifyPassword(password, user.password_hash);
  if (!matches) throw invalid;

  return { token: signAccessToken(user), user: toSafeUser(user) };
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await findUserWithHashById(userId);
  if (!user) throw unauthorized();

  const matches = await verifyPassword(currentPassword, user.password_hash);
  if (!matches) throw unauthorized("Your current password is incorrect.");

  await updatePasswordHash(userId, await hashPassword(newPassword));
  return { success: true };
}
