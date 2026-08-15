import { query, queryOne } from "../config/db.js";
import { buildMeta, resolveOrder, resolvePagination, resolveSort } from "../utils/queryOptions.js";

const SORTABLE = {
  name: "s.name",
  email: "s.email",
  address: "s.address",
  rating: "average_rating",
  owner: "owner_name",
  created_at: "s.created_at",
};

/**
 * Single aggregate query for the store list (no N+1): average rating, rating
 * count and — when a viewer id is supplied — that viewer's own rating.
 */
export async function listStores(params = {}, viewerId = null) {
  const { page, limit, offset } = resolvePagination(params, params.limit ? undefined : 12);
  const sortColumn = resolveSort(params.sortBy, SORTABLE, "name");
  const order = resolveOrder(params.order);

  const where = [];
  const values = [];

  if (viewerId) values.push(viewerId);

  if (params.search) {
    where.push("(s.name LIKE ? OR s.address LIKE ?)");
    const like = `%${params.search}%`;
    values.push(like, like);
  }
  for (const field of ["name", "email", "address"]) {
    if (params[field]) {
      where.push(`s.${field} LIKE ?`);
      values.push(`%${params[field]}%`);
    }
  }
  if (params.owner) {
    where.push("(o.name LIKE ? OR o.email LIKE ?)");
    values.push(`%${params.owner}%`, `%${params.owner}%`);
  }
  if (params.ownerId) {
    where.push("s.owner_id = ?");
    values.push(params.ownerId);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const viewerSelect = viewerId
    ? `(SELECT ur.rating FROM ratings ur WHERE ur.store_id = s.id AND ur.user_id = ?)`
    : `NULL`;

  const rows = await query(
    `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
            o.name AS owner_name, o.email AS owner_email,
            ROUND(AVG(r.rating), 2) AS average_rating,
            COUNT(r.id) AS total_ratings,
            ${viewerSelect} AS user_rating
       FROM stores s
       LEFT JOIN users o ON o.id = s.owner_id
       LEFT JOIN ratings r ON r.store_id = s.id
       ${whereSql}
       GROUP BY s.id
       ORDER BY ${sortColumn} ${order}
       LIMIT ${limit} OFFSET ${offset}`,
    values,
  );

  const countValues = viewerId ? values.slice(1) : values;
  const countRow = await queryOne(
    `SELECT COUNT(*) AS total FROM stores s LEFT JOIN users o ON o.id = s.owner_id ${whereSql}`,
    countValues,
  );

  return { data: rows, meta: buildMeta({ page, limit }, Number(countRow?.total ?? 0)) };
}

export function findStoreById(id, viewerId = null) {
  const params = viewerId ? [viewerId, id] : [id];
  const viewerSelect = viewerId
    ? `(SELECT ur.rating FROM ratings ur WHERE ur.store_id = s.id AND ur.user_id = ?)`
    : `NULL`;
  return queryOne(
    `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
            o.name AS owner_name, o.email AS owner_email,
            ROUND(AVG(r.rating), 2) AS average_rating,
            COUNT(r.id) AS total_ratings,
            ${viewerSelect} AS user_rating
       FROM stores s
       LEFT JOIN users o ON o.id = s.owner_id
       LEFT JOIN ratings r ON r.store_id = s.id
      WHERE s.id = ?
      GROUP BY s.id`,
    params,
  );
}

export async function insertStore({ name, email, address, ownerId }) {
  const result = await query(
    `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
    [name, email, address, ownerId ?? null],
  );
  return findStoreById(result.insertId);
}

export function findStoresByOwner(ownerId) {
  return query(
    `SELECT s.id, s.name, s.email, s.address, s.created_at,
            ROUND(AVG(r.rating), 2) AS average_rating,
            COUNT(r.id) AS total_ratings
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
      WHERE s.owner_id = ?
      GROUP BY s.id
      ORDER BY s.name ASC`,
    [ownerId],
  );
}

export function findStoreOwnerId(storeId) {
  return queryOne(`SELECT id, owner_id FROM stores WHERE id = ? LIMIT 1`, [storeId]);
}

export function countStores() {
  return queryOne(`SELECT COUNT(*) AS total FROM stores`);
}
