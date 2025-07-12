require('dotenv').config();
const nock = require('nock');
const { setupTestDb, teardownTestDb } = require('./setupTestDb');
const knex = require('../src/utils/db');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.RAVEN_API_URL = 'https://integrations.getravenbank.com/v1';

let db;

// Configure Raven Bank API mocks and setup database
beforeAll(async () => {
  // Setup API mocks
  nock(process.env.RAVEN_API_URL)
    .persist()
    .get('/get-transfer')
    .query(true)
    .reply(200, {
      status: 'success',
      message: 'Transfer retrieved successfully',
      data: {
        id: 1,
        amount: '1000.00',
        status: 'completed',
        reference: 'test-transfer-ref',
        created_at: new Date().toISOString()
      }
    });

  // Clean up any existing test database
  await teardownTestDb();

  // Initialize fresh test database
  db = await setupTestDb();
}, 30000);

// Clean up after each test suite
afterAll(async () => {
  // Clean up nock
  nock.cleanAll();

  // Clean up database connections
  if (db) {
    await db.destroy();
  }
  await knex.destroy();

  // Clean up test database
  await teardownTestDb();

  // Give time for connections to close
  await new Promise(resolve => setTimeout(resolve, 1000));
});
