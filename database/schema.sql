-- ============================================================
-- RateSphere — MySQL schema
-- Run with:  mysql -u root -p < database/schema.sql
--       or:  cd backend && npm run db:schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS ratesphere
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ratesphere;

-- Drop in dependency order so the script is re-runnable.
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS users;

-- ------------------------------------------------------------
-- users
-- ------------------------------------------------------------
CREATE TABLE users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(60)  NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  address       VARCHAR(400) NOT NULL,
  role          ENUM('administrator', 'normal_user', 'store_owner')
                NOT NULL DEFAULT 'normal_user',
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role),
  KEY idx_users_name (name),
  CONSTRAINT chk_users_name_length CHECK (CHAR_LENGTH(name) BETWEEN 20 AND 60),
  CONSTRAINT chk_users_address_length CHECK (CHAR_LENGTH(address) <= 400)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- stores
-- ------------------------------------------------------------
CREATE TABLE stores (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(120) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  address    VARCHAR(400) NOT NULL,
  owner_id   INT UNSIGNED NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
             ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_stores_email (email),
  KEY idx_stores_name (name),
  KEY idx_stores_address (address(191)),
  KEY idx_stores_owner (owner_id),
  CONSTRAINT fk_stores_owner
    FOREIGN KEY (owner_id) REFERENCES users (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- ratings
--   * one rating per (user, store) — enforced by a UNIQUE key
--   * value constrained to 1..5 at the database level
--   * cascading deletes prevent orphaned rating rows
-- ------------------------------------------------------------
CREATE TABLE ratings (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  store_id   INT UNSIGNED NOT NULL,
  rating     TINYINT UNSIGNED NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
             ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ratings_user_store (user_id, store_id),
  KEY idx_ratings_store (store_id),
  KEY idx_ratings_user (user_id),
  KEY idx_ratings_store_rating (store_id, rating),
  CONSTRAINT chk_ratings_range CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_ratings_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ratings_store
    FOREIGN KEY (store_id) REFERENCES stores (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Convenience view: per-store aggregate rating data.
CREATE OR REPLACE VIEW store_rating_summary AS
SELECT s.id           AS store_id,
       s.name         AS store_name,
       s.owner_id     AS owner_id,
       COUNT(r.id)    AS total_ratings,
       ROUND(AVG(r.rating), 2) AS average_rating
  FROM stores s
  LEFT JOIN ratings r ON r.store_id = s.id
 GROUP BY s.id;
