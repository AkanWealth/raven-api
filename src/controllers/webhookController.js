const axios = require('axios');
const qs = require('qs');
const accountService = require('../services/accountService');
const transactionService = require('../services/transactionService');

const handleBankTransfer = async (req, res) => {
  try {
    const { accountReference, amount, status, metadata } = req.body;

    if (!accountReference || !amount || !status) {
      console.error('Missing required webhook parameters:', { accountReference, amount, status });
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Find the account by reference using service
    const account = await accountService.getAccountByReference(accountReference);
    if (!account) {
      console.error('Account not found for reference:', accountReference);
      return res.status(404).json({ message: 'Account not found' });
    }

    // Map webhook status to transaction status
    const statusMap = {
      'success': 'completed',
      'completed': 'completed',
      'failed': 'failed',
      'pending': 'pending'
    };
    const transactionStatus = statusMap[status] || status;

    // Find the transaction by reference and update its status
    if (metadata?.reference) {
      await transactionService.updateTransactionStatusByReference(metadata.reference, transactionStatus);
    }

    // Create the transaction record using service
    await transactionService.createTransaction({
      userId: account.userId,
      type: 'deposit',
      amount,
      status: transactionStatus,
      description: 'Bank transfer webhook',
      reference: metadata?.reference || `WEBHOOK-${Date.now()}`,
      metadata
    });

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const configureWebhook = async (req, res) => {
  try {
    const data = qs.stringify({
      'webhook_url': process.env.WEBHOOK_URL || 'https://webhook.site/b577d72f-d41b-4eb6-b766-324dc34775c5',
      'webhook_secret_key': process.env.WEBHOOK_SECRET_KEY || '1828393930293094938'
    });

    const config = {
      method: 'post',
      url: 'https://integrations.getravenbank.com/v1/webhooks/update',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    const response = await axios(config);
    return res.status(200).json({
      message: 'Webhook configured successfully',
      data: response.data
    });
  } catch (error) {
    console.error('Webhook configuration error:', error);
    return res.status(500).json({ message: 'Failed to configure webhook' });
  }
};

module.exports = {
  handleBankTransfer,
  configureWebhook
};
