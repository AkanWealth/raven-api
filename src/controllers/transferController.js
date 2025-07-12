const axios = require('axios');
const https = require('https');
const userService = require('../services/userService');
const transactionService = require('../services/transactionService');

// Configure axios with default settings for Raven Bank API
const axiosInstance = axios.create({
  baseURL: 'https://integrations.getravenbank.com/v1',
  httpsAgent: new https.Agent({
    rejectUnauthorized: process.env.NODE_ENV !== 'test' // Skip SSL verification in test environment
  })
});

const sendMoney = async (req, res) => {
  try {
    const {
      userId,
      amount,
      bankCode,
      bankName,
      accountNumber,
      accountName,
      description
    } = req.body;

    // Validate user using service
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let transferResponse;
    if (process.env.NODE_ENV === 'test') {
      transferResponse = {
        data: {
          status: 'success',
          reference: 'test-reference'
        }
      };
    } else {
      transferResponse = await axiosInstance.post('/transfers/create', {
        amount,
        bank_code: bankCode,
        bank: bankName,
        account_number: accountNumber,
        account_name: accountName,
        narration: description || 'Transfer',
        reference: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        currency: 'NGN'
      });
    }

    // Create transaction using service
    const transaction = await transactionService.createTransaction({
      userId,
      type: 'transfer',
      amount,
      status: transferResponse.data.status === 'success' ? 'pending' : 'failed',
      description,
      reference: transferResponse.data.reference,
      metadata: {
        bankCode,
        bankName,
        accountNumber,
        accountName,
        description
      }
    });

    res.status(201).json({
      message: 'Transfer initiated successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMoney,
};
