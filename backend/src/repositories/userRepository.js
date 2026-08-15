import { query, queryOne } from "../config/db.js";
import { buildMeta, resolveOrder, resolvePagination, resolveSort } from "../utils/queryOptions.js";

/** Columns that are safe to return to clients — password_hash is never selected. */
const SAFE_COLUMNS = "id, name, email, address, role, created_at, updated_at";

const SORTABLE = {
  name: "u.name",
  email: "u.email",
  address: "u.address",
  role: "u.role",
  created_at: "u.created_at",
};

export function findUserByEmail(email) {
  return queryOne(
    `SELECT id, name, email, address, role, password_hash FROM users WHERE email = ? LIMIT 1`,
    [email],
  );
}

export function findUserById(id) {
  return queryOne(`SELECT ${SAFE_COLUMNS} FROM users WHERE id = ? LIMIT 1`, [id]);
}

export function findUserWithHashById(id) {
  return queryOne(`SELECT ${SAFE_COLUMNS}, password_hash FROM users WHERE id = ? LIMIT 1`, [id]);
}

export async function insertUser({ name, email, address, passwordHash, role }) {
  const result = await query(
    `INSERT INTO users (name, email, address, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
    [name, email, address, passwordHash, role],
  );
  return findUserById(result.insertId);
}

export function updatePasswordHash(userId, passwordHash) {
  return query(`UPDATE users SET password_hash = ? WHERE id = ?`, [passwordHash, userId]);
}

/**
 * Paginated, searchable, sortable user list.
 * Search terms are bound as parameters; sort keys go through an allow-list.
 */
export async function listUsers(params = {}) {
  const { page, limit, offset } = resolvePagination(params);
  const sortColumn = resolveSort(params.sortBy, SORTABLE, "name");
  const order = resolveOrder(params.order);

  const where = [];
  const values = [];

  if (params.search) {
    where.push("(u.name LIKE ? OR u.email LIKE ? OR u.address LIKE ?)");
    const like = `%${params.search}%`;
    values.push(like, like, like);
  }
  for (const field of ["name", "email", "address"]) {
    if (params[field]) {
      where.push(`u.${field} LIKE ?`);
      values.push(`%${params[field]}%`);
    }
  }
  if (params.role) {
    where.push("u.role = ?");
    values.push(params.role);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const rows = await query(
    `SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
            ROUND(AVG(r.rating), 2) AS owner_average_rating,
            COUNT(r.id) AS owner_total_ratings
       FROM users u
       LEFT JOIN stores s ON s.owner_id = u.id AND u.role = 'store_owner'
       LEFT JOIN ratings r ON r.store_id = s.id
       ${whereSql}
       GROUP BY u.id
       ORDER BY ${sortColumn} ${order}
       LIMIT ${limit} OFFSET ${offset}`,
    values,
  );

  const countRow = await queryOne(
    `SELECT COUNT(*) AS total FROM users u ${whereSql}`,
    values,
  );

  return { data: rows, meta: buildMeta({ page, limit }, Number(countRow?.total ?? 0)) };
}

export function countUsers() {
  return queryOne(`SELECT COUNT(*) AS total FROM users`);
}

export function listOwnerCandidates() {
  return query(
    `SELECT id, name, email FROM users WHERE role = 'store_owner' ORDER BY name ASC`,
  );
}
