const axios = require('axios');
const qs = require('qs');
const transactionService = require('../services/transactionService');
const userService = require('../services/userService');

const getTransactions = async (req, res) => {
  try {
    const { userId, type, status } = req.query;

    // Validate user using service
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch transactions using service
    let transactions = await transactionService.getTransactionsByUserId(userId);
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }
    if (status) {
      transactions = transactions.filter(t => t.status === status);
    }

    // Add description from metadata to each transaction
    const enhancedTransactions = transactions.map(transaction => {
      let metadata = {};
      try {
        // Ensure metadata is a string and not null/undefined before parsing
        if (typeof transaction.metadata === 'string' && transaction.metadata.trim()) {
          metadata = JSON.parse(transaction.metadata);
        } else if (typeof transaction.metadata === 'object' && transaction.metadata !== null) {
          // If metadata is already an object, use it directly
          metadata = transaction.metadata;
        }
      } catch (err) {
        console.error(`Error parsing metadata for transaction ${transaction.id}:`, err);
        // Set a default metadata object if parsing fails
        metadata = { error: 'Invalid metadata format' };
      }

      return {
        ...transaction,
        metadata,
        description: metadata.description || 'No description available'
      };
    });

    res.status(200).json({ transactions: enhancedTransactions });
  } catch (error) {
    console.error('Transaction fetch error:', error);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const {
      userId,
      type,
      amount,
      description,
      bankCode,
      bankName,
      accountNumber,
      accountName,
      currency = 'NGN',
      metadata = {}
    } = req.body;

    // Validate user
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert amount to number
    const numericAmount = Number(amount);

    // Generate reference
    const reference = `txn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // If it's a transfer, initiate bank transfer
    if (type === 'transfer') {
      const transferData = qs.stringify({
        amount: amount.toString(),
        bank_code: bankCode,
        bank: bankName,
        account_number: accountNumber,
        account_name: accountName,
        narration: description || 'Transfer',
        reference,
        currency
      });

      const config = {
        method: 'post',
        url: 'https://integrations.getravenbank.com/v1/transfers/create',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: transferData
      };

      try {
        await axios(config);
      } catch (error) {
        console.error('Raven Bank API Error:', error.response?.data || error.message);
        throw new Error('Bank transfer failed');
      }
    }

    // Prepare metadata as an object
    const transactionMetadata = {
      ...metadata,
      description,
      bankCode,
      bankName,
      accountNumber,
      accountName,
      currency
    };

    // Create transaction record using service
    const transaction = await transactionService.createTransaction({
      userId,
      type,
      amount: numericAmount,
      reference,
      metadata: transactionMetadata
    });

    res.status(201).json({ transaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      message: 'Error creating transaction',
      error: error.message
    });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'completed', 'failed', 'success'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Update the transaction status using service
    const updatedTransaction = await transactionService.updateTransactionStatus(id, status);

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    return res.status(200).json({ transaction: updatedTransaction });
  } catch (error) {
    console.error('Error updating transaction status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransactionStatus
};
