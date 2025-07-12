const express = require('express');
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Get transactions with optional filters (protected)
router.get('/', authMiddleware, transactionController.getTransactions);

// Create a new transaction (protected)
router.post('/', authMiddleware, transactionController.createTransaction);

// Update transaction status (protected)
router.patch('/:id/status', authMiddleware, transactionController.updateTransactionStatus);

module.exports = router;
