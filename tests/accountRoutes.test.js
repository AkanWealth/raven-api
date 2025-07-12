const request = require('supertest');
const app = require('../src/app');
const knex = require('../src/utils/db');
const { setupTestDb, teardownTestDb } = require('./setupTestDb');

describe('Account Routes', () => {
  let testUser;

  beforeAll(async () => {
    // Initialize test database and run migrations
    await setupTestDb();
    // Get test user
    testUser = await knex('users').where({ email: 'testuser@example.com' }).first();
  });

  afterAll(async () => {
    // Clean up test database
    await teardownTestDb();
    await knex.destroy();
  });

  describe('POST /api/accounts/generate', () => {
    it('should generate a unique bank account for a user', async () => {
      const response = await request(app)
        .post('/api/accounts/generate')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ userId: 1 });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Account created successfully');
      expect(response.body).toHaveProperty('accountNumber');
      expect(response.body).toHaveProperty('accountReference');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/accounts/generate')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ userId: 999 });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('GET /api/accounts', () => {
    it('should get all accounts for a user', async () => {
      // Create a new test account with a unique account number
      await knex('accounts').insert({
        user_id: testUser.id,
        bank_name: 'Another Test Bank',
        account_number: '5555666677',
        account_reference: 'TEST-REF-456',
        status: 'active'
      });

      const response = await request(app)
        .get('/api/accounts')
        .query({ userId: testUser.id });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.accounts)).toBe(true);
      expect(response.body.accounts.length).toBeGreaterThan(0);
    });
  });
});
