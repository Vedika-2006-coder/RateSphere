import { env } from "../config/env.js";
import { HttpError, notFound } from "../utils/httpError.js";

export function notFoundHandler(_req, _res, next) {
  next(notFound("The requested endpoint does not exist."));
}

/* eslint-disable-next-line no-unused-vars */
export function errorHandler(error, _req, res, _next) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      error: { code: error.code, message: error.message, details: error.details },
    });
  }

  // MySQL constraint violations mapped to meaningful API responses.
  if (error?.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      error: { code: "CONFLICT", message: "That record already exists." },
    });
  }
  if (error?.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "A referenced record does not exist." },
    });
  }

  // Log server-side only; never leak stack traces to clients.
  console.error("[ratesphere]", error);
  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message:
        env.nodeEnv === "production"
          ? "Something went wrong. Please try again."
          : (error?.message ?? "Internal server error."),
    },
  });
}
