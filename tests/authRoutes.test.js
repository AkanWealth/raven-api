require('./testConfig');
const request = require('supertest');
const app = require('../src/app');
const knex = require('../src/utils/db');
const { setupTestDb, teardownTestDb } = require('./setupTestDb');

describe('Authentication Routes', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
    await knex.destroy();
  });

  describe('POST /api/auth/register', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User created successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('name', 'John Doe');
      expect(response.body.user).toHaveProperty('email', 'john@example.com');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in an existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });
});
