import { createApp } from "./app.js";
import { assertDatabaseConnection } from "./config/db.js";
import { env } from "./config/env.js";

async function start() {
  try {
    await assertDatabaseConnection();
    console.log(`[ratesphere] connected to MySQL database "${env.db.database}"`);
  } catch (error) {
    console.error("[ratesphere] could not connect to MySQL:", error.message);
    process.exit(1);
  }

  createApp().listen(env.port, () => {
    console.log(`[ratesphere] API listening on http://localhost:${env.port}/api`);
  });
}

start();
