const request = require('supertest');
const app = require('../src/app');
const knex = require('../src/utils/db');
const { setupTestDb, teardownTestDb } = require('./setupTestDb');

describe('Webhook Routes', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
    await knex.destroy();
  });

  describe('POST /api/webhooks/bank-transfer', () => {
    it('should process a bank transfer webhook', async () => {
      const response = await request(app)
        .post('/api/webhooks/bank-transfer')
        .send({
          accountReference: 'unique-ref-123',
          amount: 100,
          status: 'completed',
          metadata: { reference: 'txn-ref-456' },
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Webhook processed successfully');
    });
  });
});
