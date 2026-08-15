import { findUserById } from "../repositories/userRepository.js";
import { forbidden, unauthorized } from "../utils/httpError.js";
import { verifyAccessToken } from "../utils/jwt.js";

/**
 * Authentication middleware.
 * The role is re-read from the database on every request, so a stale or
 * tampered token can never grant a role the user no longer holds.
 */
export async function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization ?? "";
    if (!header.startsWith("Bearer ")) {
      throw unauthorized();
    }

    let payload;
    try {
      payload = verifyAccessToken(header.slice(7));
    } catch {
      throw unauthorized("Your session has expired. Please sign in again.");
    }

    const user = await findUserById(Number(payload.sub));
    if (!user) throw unauthorized("Your session is no longer valid.");

    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
}

/** Role authorization middleware. Never trusts a role sent by the client. */
export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(unauthorized());
    if (!roles.includes(req.user.role)) return next(forbidden());
    return next();
  };
}
