const express = require('express');
const webhookController = require('../controllers/webhookController');

const router = express.Router();

// Webhook endpoint for bank transfer notifications
router.post('/bank-transfer', webhookController.handleBankTransfer);

// Configure webhook endpoint
router.post('/configure', webhookController.configureWebhook);

module.exports = router;
