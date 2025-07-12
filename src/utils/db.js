const knex = require('knex');
const knexfile = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];

if (!config) {
  throw new Error(`No database configuration found for environment: ${environment}`);
}

const db = knex(config);

// Initialize database and run migrations
async function initializeDatabase() {
  try {
    const dbName = config.connection.database;

    // Create a temporary connection without database selected
    const tempConfig = {
      ...config,
      connection: {
        ...config.connection,
        database: undefined
      }
    };
    const tempDb = knex(tempConfig);

    // Create database if it doesn't exist
    await tempDb.raw(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await tempDb.destroy();

    // Run migrations on the main connection
    await db.migrate.latest();

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Run initialization if not in test environment
if (process.env.NODE_ENV !== 'test') {
  initializeDatabase();
}

module.exports = db;
module.exports.initializeDatabase = initializeDatabase;

