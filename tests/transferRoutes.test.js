const request = require('supertest');
const app = require('../src/app');
const knex = require('../src/utils/db');
const { setupTestDb, teardownTestDb } = require('./setupTestDb');

describe('Transfer Routes', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
    await knex.destroy();
  });

  describe('POST /api/transfers/send', () => {
    it('should send money to another bank', async () => {
      const response = await request(app)
        .post('/api/transfers/send')
        .send({
          userId: 1,
          recipientBank: 'Test Bank',
          recipientAccount: '9876543210',
          amount: 10,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Transfer successful');
      expect(response.body).toHaveProperty('data');
    });
  });
});
