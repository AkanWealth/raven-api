const request = require('supertest');
const app = require('../src/app');
const knex = require('../src/utils/db');
const { setupTestDb, teardownTestDb } = require('./setupTestDb');

describe('Transaction Routes', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
    await knex.destroy();
  });

  describe('GET /api/transactions', () => {
    it('should retrieve all transactions for a user', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .query({ userId: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('transactions');
      expect(response.body.transactions.length).toBe(2);
    });

    it('should retrieve only deposits for a user', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .query({ userId: 1, type: 'deposit' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('transactions');
      expect(response.body.transactions.length).toBe(1);
      expect(response.body.transactions[0].type).toBe('deposit');
    });

    it('should filter transactions by status', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .query({ userId: 1, status: 'completed' });

      expect(response.status).toBe(200);
      expect(response.body.transactions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ status: 'completed' })
        ])
      );
    });
  });

  describe('POST /api/transactions', () => {
    it('should create a new transaction', async () => {
      const newTransaction = {
        userId: 1,
        type: 'deposit',
        amount: 200,
        description: 'Test deposit'
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(newTransaction);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('transaction');
      expect(response.body.transaction).toMatchObject({
        user_id: 1,
        type: 'deposit',
        amount: 200,
        status: 'pending',
        description: 'Test deposit'
      });
    });

    it('should return 404 for non-existent user', async () => {
      const newTransaction = {
        userId: 999,
        type: 'deposit',
        amount: 200
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(newTransaction);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('PATCH /api/transactions/:id/status', () => {
    it('should update transaction status to success', async () => {
      const [transaction] = await knex('transactions')
        .where({ user_id: 1 })
        .limit(1);

      const response = await request(app)
        .patch(`/api/transactions/${transaction.id}/status`)
        .send({ status: 'success' });

      expect(response.status).toBe(200);
      expect(response.body.transaction).toMatchObject({
        id: transaction.id,
        status: 'success'
      });
    });

    it('should reject invalid status values', async () => {
      const [transaction] = await knex('transactions')
        .where({ user_id: 1 })
        .limit(1);

      const response = await request(app)
        .patch(`/api/transactions/${transaction.id}/status`)
        .send({ status: 'invalid_status' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid status value');
    });

    it('should return 404 for non-existent transaction', async () => {
      const response = await request(app)
        .patch('/api/transactions/999/status')
        .send({ status: 'completed' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Transaction not found');
    });
  });
});
