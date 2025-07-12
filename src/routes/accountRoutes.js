const express = require('express');
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Generate a unique bank account (protected)
router.post('/generate', authMiddleware, accountController.generateAccount);

// Get all accounts for a user (protected)
router.get('/', authMiddleware, accountController.getAccounts);

// Get wallet balance (protected)
router.post('/wallet-balance', authMiddleware, accountController.getWalletBalance);

// Update webhook (protected)
router.post('/webhook/update', authMiddleware, accountController.updateWebhook);

module.exports = router;
