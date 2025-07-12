const db = require('../utils/db');
const axios = require('axios');
const qs = require('qs');

// Account service: business logic for accounts
class AccountService {
    // Example: get account by user ID
    async getAccountByUserId(userId) {
        return db('accounts').where({user_id: userId}).first();
    }

    async createAccount(data) {
        const [id] = await db('accounts').insert(data);
        return db('accounts').where({id}).first();
    }

    async updateAccountBalance(userId, amount) {
        await db('accounts').where({user_id: userId}).increment('balance', amount);
        return this.getAccountByUserId(userId);
    }

    async getAccountByReference(accountReference) {
        return db('accounts').where({account_reference: accountReference}).first();
    }

    async getWalletBalance(authHeader) {
        const config = {
            method: 'post',
            url: 'https://integrations.getravenbank.com/v1/accounts/wallet_balance',
            headers: {
                Authorization: authHeader || ''
            }
        };
        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch wallet balance');
        }
    }

    async updateWebhook() {
        const webhookUrl = 'https://webhook.site/b577d72f-d41b-4eb6-b766-324dc34775c5';
        const webhookSecretKey = '1828393930293094938';
        const data = qs.stringify({
            webhook_url: webhookUrl,
            webhook_secret_key: webhookSecretKey
        });
        const config = {
            method: 'post',
            url: 'https://integrations.getravenbank.com/v1/webhooks/update',
            headers: "RVPUB-365fcb3e6b6561218ecb451b54588db051fa02264815a774ae6891d92b22-1752323508532",
            data: data
        };
        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            throw new Error('Failed to update webhook');
        }
    }
}

module.exports = new AccountService();
