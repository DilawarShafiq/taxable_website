#!/usr/bin/env node
// Adds email column to profiles table
import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
  host: "34.122.204.241", port: 5432, database: "taxable_ai",
  user: "postgres", password: "TaxableAI2026!Secure",
  ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000,
});
const client = await pool.connect();
await client.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text`);
console.log("Done: profiles.email column added");
client.release();
await pool.end();
