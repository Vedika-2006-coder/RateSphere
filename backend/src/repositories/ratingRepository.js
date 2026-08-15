import { query, queryOne } from "../config/db.js";

export function findRating(userId, storeId) {
  return queryOne(`SELECT * FROM ratings WHERE user_id = ? AND store_id = ? LIMIT 1`, [
    userId,
    storeId,
  ]);
}

export async function insertRating(userId, storeId, rating) {
  await query(`INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)`, [
    userId,
    storeId,
    rating,
  ]);
  return findRating(userId, storeId);
}

export async function updateRating(userId, storeId, rating) {
  await query(`UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?`, [
    rating,
    userId,
    storeId,
  ]);
  return findRating(userId, storeId);
}

export function listStoreRatings(storeId) {
  return query(
    `SELECT r.id, r.rating, r.created_at, r.updated_at,
            u.id AS user_id, u.name AS user_name, u.email AS user_email
       FROM ratings r
       JOIN users u ON u.id = r.user_id
      WHERE r.store_id = ?
      ORDER BY r.updated_at DESC`,
    [storeId],
  );
}

export function listUserRatings(userId) {
  return query(
    `SELECT r.id, r.rating, r.created_at, r.updated_at,
            s.id AS store_id, s.name AS store_name, s.address AS store_address,
            (SELECT ROUND(AVG(r2.rating), 2) FROM ratings r2 WHERE r2.store_id = s.id) AS average_rating
       FROM ratings r
       JOIN stores s ON s.id = r.store_id
      WHERE r.user_id = ?
      ORDER BY r.updated_at DESC`,
    [userId],
  );
}

export function ratingDistributionForStores(storeIds) {
  if (!storeIds.length) return Promise.resolve([]);
  const placeholders = storeIds.map(() => "?").join(", ");
  return query(
    `SELECT rating, COUNT(*) AS count
       FROM ratings
      WHERE store_id IN (${placeholders})
      GROUP BY rating
      ORDER BY rating ASC`,
    storeIds,
  );
}

export function recentRatingsForStores(storeIds, limit = 8) {
  if (!storeIds.length) return Promise.resolve([]);
  const placeholders = storeIds.map(() => "?").join(", ");
  return query(
    `SELECT r.id, r.rating, r.updated_at,
            u.name AS user_name, u.email AS user_email,
            s.name AS store_name
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       JOIN stores s ON s.id = r.store_id
      WHERE r.store_id IN (${placeholders})
      ORDER BY r.updated_at DESC
      LIMIT ${Number(limit)}`,
    storeIds,
  );
}

export function countRatings() {
  return queryOne(`SELECT COUNT(*) AS total FROM ratings`);
}

export function globalRatingDistribution() {
  return query(
    `SELECT rating, COUNT(*) AS count FROM ratings GROUP BY rating ORDER BY rating ASC`,
  );
}

export function userRatingSummary(userId) {
  return queryOne(
    `SELECT COUNT(*) AS rated_count, ROUND(AVG(rating), 2) AS average_given
       FROM ratings WHERE user_id = ?`,
    [userId],
  );
}
