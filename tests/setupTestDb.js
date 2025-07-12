const knex = require('knex');
const bcrypt = require('bcrypt');
const knexfile = require('../knexfile');

async function setupTestDb() {
  const config = knexfile.test;
  const dbName = config.connection.database;

  // Create a connection without database selected
  const tempKnex = knex({
    client: 'mysql2',
    connection: {
      host: config.connection.host,
      user: config.connection.user,
      password: config.connection.password
    }
  });

  try {
    // Drop and recreate the test database
    await tempKnex.raw(`DROP DATABASE IF EXISTS ${dbName}`);
    await tempKnex.raw(`CREATE DATABASE ${dbName}`);

    // Create a new connection to the test database
    const testDb = knex({
      ...config,
      connection: {
        ...config.connection,
        database: dbName
      }
    });

    // Run migrations
    await testDb.migrate.latest();

    // Create test data
    const passwordHash = await bcrypt.hash('password123', 10);

    // Insert test user
    const [userId] = await testDb('users').insert({
      name: 'Test User',
      email: 'testuser@example.com',
      password_hash: passwordHash
    });

    // Insert test account
    const [accountId] = await testDb('accounts').insert({
      user_id: userId,
      bank_name: 'Test Bank',
      account_number: '1234567890',
      account_reference: 'TEST-REF-123',
      status: 'active'
    });

    // Insert a test account for webhook
    await testDb('accounts').insert({
      user_id: userId,
      bank_name: 'Test Bank 2',
      account_number: '9876543210',
      account_reference: 'unique-ref-123',
      status: 'active'
    });

    // Insert test transactions
    await testDb('transactions').insert([
      {
        user_id: userId,
        type: 'deposit',
        amount: 1000.00,
        status: 'completed',
        description: 'Test deposit',
        reference: 'DEP-TEST-001'
      },
      {
        user_id: userId,
        type: 'withdrawal',
        amount: 500.00,
        status: 'completed',
        description: 'Test withdrawal',
        reference: 'WIT-TEST-001'
      }
    ]);

    return testDb;
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  } finally {
    await tempKnex.destroy();
  }
}

async function teardownTestDb() {
  const config = knexfile.test;
  const dbName = config.connection.database;

  const tempKnex = knex({
    client: 'mysql2',
    connection: {
      host: config.connection.host,
      user: config.connection.user,
      password: config.connection.password
    }
  });

  try {
    await tempKnex.raw(`DROP DATABASE IF EXISTS ${dbName}`);
  } catch (error) {
    console.error('Error tearing down test database:', error);
    throw error;
  } finally {
    await tempKnex.destroy();
  }
}

module.exports = { setupTestDb, teardownTestDb };
