const db = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

// Transaction service: business logic for transactions
class TransactionService {
  // Example: create a transaction
  async createTransaction(data) {
    let reference = data.reference;
    if (!reference) {
      reference = `txn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }
    // Check for duplicate reference
    const existing = await db('transactions').where({ reference }).first();
    if (existing) {
      reference = `txn-${Date.now()}-${uuidv4()}`;
    }
    const transactionData = {
      ...data,
      user_id: data.userId,
      reference,
    };
    delete transactionData.userId;
    const [id] = await db('transactions').insert(transactionData);
    return db('transactions').where({ id }).first();
  }
  async getTransactionsByUserId(userId, filters = {}) {
    // Build a query with correct column names and filters
    let query = db('transactions').where({ user_id: userId });
    if (filters.type) {
      query = query.andWhere({ type: filters.type });
    }
    if (filters.status) {
      query = query.andWhere({ status: filters.status });
    }
    return query;
  }
  async getTransactionById(id) {
    return db('transactions').where({ id }).first();
  }
  async updateTransactionStatusByReference(reference, status) {
    await db('transactions').where({ reference }).update({ status });
    return db('transactions').where({ reference }).first();
  }
}
module.exports = new TransactionService();
