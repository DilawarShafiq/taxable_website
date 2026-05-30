// Re-export everything from kysely and add missing migration constants
// removed in 0.27+ but still referenced by @better-auth/kysely-adapter
const kysely = require('kysely');
module.exports = {
  ...kysely,
  DEFAULT_MIGRATION_LOCK_TABLE: 'kysely_migration_lock',
  DEFAULT_MIGRATION_TABLE: 'kysely_migration',
};
