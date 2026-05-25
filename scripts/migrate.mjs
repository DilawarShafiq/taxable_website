#!/usr/bin/env node
// Run: node scripts/migrate.mjs
// Connects to Cloud SQL via public IP and applies 002_cloud_sql_schema.sql

import pg from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { Pool } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const pool = new Pool({
  host: process.env.DB_HOST ?? "34.122.204.241",
  port: 5432,
  database: process.env.DB_NAME ?? "taxable_ai",
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASS ?? "TaxableAI2026!Secure",
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

const sqlFile = join(__dirname, "../supabase/migrations/002_cloud_sql_schema.sql");
const sql = readFileSync(sqlFile, "utf8");

console.log("Connecting to Cloud SQL...");
try {
  const client = await pool.connect();
  console.log("Connected. Running migration...");
  await client.query(sql);
  client.release();
  console.log("Migration complete.");
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exit(1);
} finally {
  await pool.end();
}
