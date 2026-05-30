const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../node_modules/kysely/dist/index.js');
if (!fs.existsSync(file)) { console.log('kysely not found, skipping patch'); process.exit(0); }

const content = fs.readFileSync(file, 'utf8');
if (content.includes('DEFAULT_MIGRATION_LOCK_TABLE')) { console.log('kysely already patched'); process.exit(0); }

// These constants were removed in kysely 0.27 but @better-auth/kysely-adapter still imports them
fs.appendFileSync(file, `\nexport const DEFAULT_MIGRATION_LOCK_TABLE = 'kysely_migration_lock';\nexport const DEFAULT_MIGRATION_TABLE = 'kysely_migration';\n`);
console.log('Patched kysely: added DEFAULT_MIGRATION_LOCK_TABLE and DEFAULT_MIGRATION_TABLE');
