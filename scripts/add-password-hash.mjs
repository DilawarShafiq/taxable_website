import pg from "pg";

const { Client } = pg;

const client = new Client({
  host: "34.122.204.241",
  port: 5432,
  database: "taxable_ai",
  user: "postgres",
  password: "TaxableAI2026!Secure",
  ssl: false,
});

await client.connect();

console.log("Adding password_hash column and email unique constraint...");

await client.query(`
  ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS password_hash text;
`);

await client.query(`
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'profiles_email_key' AND conrelid = 'profiles'::regclass
    ) THEN
      ALTER TABLE profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
    END IF;
  END $$;
`);

// Remove stale Firebase-created profile so the admin can re-register
await client.query(`
  DELETE FROM profiles WHERE email = 'dilawar.gopang@gmail.com' AND password_hash IS NULL;
`);

console.log("Done.");
await client.end();
