const accountService = require('../services/accountService');
const userService = require('../services/userService');
const { v4: uuidv4 } = require('uuid');

const generateAccount = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if user exists using service
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate unique account details
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const accountReference = uuidv4();

    // Insert account using service
    const account = await accountService.createAccount({
      userId,
      bankName: 'Raven Bank',
      accountNumber,
      accountReference,
      balance: 0.0,
      status: 'active',
    });

    res.status(201).json({
      message: 'Account created successfully',
      account,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAccounts = async (req, res) => {
  try {
    // Get userId from JWT payload
    const userId = req.user.userId || req.user.id || req.user.user_id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }
    // Fetch accounts for the user
    const accounts = await accountService.getAccountByUserId(userId);
    // Fetch wallet balance from external API
    let walletBalance = null;
    try {
      walletBalance = await accountService.getWalletBalance();
    } catch (err) {
      walletBalance = { error: err.message };
    }
    console.log('Fetched accounts:', accounts);
    if (!accounts) {
      return res.status(404).json({ message: 'No accounts found for user' });
    }
    res.status(200).json({ accounts, walletBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWalletBalance = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const walletBalance = await accountService.getWalletBalance(authHeader);
    res.status(200).json({ walletBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWebhook = async (req, res) => {
  try {
    const result = await accountService.updateWebhook();
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateAccount,
  getAccounts,
  getWalletBalance,
  updateWebhook,
};
