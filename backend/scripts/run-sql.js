/**
 * Executes a .sql file against the configured MySQL server.
 * Usage: node scripts/run-sql.js ../database/schema.sql
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/run-sql.js <path-to-sql-file>");
  process.exit(1);
}

const sql = await readFile(path.resolve(process.cwd(), file), "utf8");

const connection = await mysql.createConnection({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  multipleStatements: true,
});

try {
  await connection.query(sql);
  console.log(`[ratesphere] executed ${file}`);
} finally {
  await connection.end();
}
