/**
 * Helpers that turn untrusted query-string input into safe SQL fragments.
 * Sort columns are resolved through an allow-list so user input never reaches
 * the SQL string; all value comparisons stay parameterised.
 */

export function resolveSort(requested, allowed, fallback) {
  const key = typeof requested === "string" ? requested : "";
  return allowed[key] ?? allowed[fallback];
}

export function resolveOrder(requested) {
  return String(requested).toLowerCase() === "desc" ? "DESC" : "ASC";
}

export function resolvePagination(queryParams, defaultLimit = 10) {
  const page = Math.max(1, Number.parseInt(queryParams.page ?? "1", 10) || 1);
  const rawLimit = Number.parseInt(queryParams.limit ?? String(defaultLimit), 10) || defaultLimit;
  const limit = Math.min(100, Math.max(1, rawLimit));
  return { page, limit, offset: (page - 1) * limit };
}

export function buildMeta({ page, limit }, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}
