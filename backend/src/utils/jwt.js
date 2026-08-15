import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

/** JWT carries only the claims required for authorization decisions. */
export function signAccessToken(user) {
  return jwt.sign({ sub: String(user.id), role: user.role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
    issuer: "ratesphere",
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.secret, { issuer: "ratesphere" });
}
