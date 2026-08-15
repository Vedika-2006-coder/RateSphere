import { badRequest } from "../utils/httpError.js";

/** Validates `req.body` against a Zod schema and replaces it with parsed data. */
export function validateBody(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".") || "form";
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return next(badRequest("Please correct the highlighted fields.", fieldErrors));
    }
    req.body = result.data;
    return next();
  };
}
