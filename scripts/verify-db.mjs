#!/usr/bin/env node
import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
  host: "34.122.204.241", port: 5432, database: "taxable_ai",
  user: "postgres", password: "TaxableAI2026!Secure",
  ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000,
});
const client = await pool.connect();
const { rows } = await client.query(
  "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
);
console.log("Tables:", rows.map(r => r.tablename).join(", "));
client.release();
await pool.end();
