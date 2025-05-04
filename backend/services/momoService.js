const axios = require('axios');
const crypto = require('crypto');

// Configuration
const MOMO_API_KEY = process.env.MOMO_API_KEY;
const MOMO_USER_ID = process.env.MOMO_USER_ID;
const MOMO_PRIMARY_KEY = process.env.MOMO_PRIMARY_KEY;
const MOMO_CALLBACK_URL = process.env.MOMO_CALLBACK_URL;
const MOMO_ENVIRONMENT = process.env.MOMO_ENVIRONMENT || 'sandbox';

const baseUrl = MOMO_ENVIRONMENT === 'production' 
    ? 'https://api.mtn.com/v1' 
    : 'https://sandbox.momodeveloper.mtn.com';

// Generate access token
const getAccessToken = async () => {
    try {
        const credentials = Buffer.from(`${MOMO_USER_ID}:${MOMO_API_KEY}`).toString('base64');
        
        const response = await axios.post(`${baseUrl}/collection/token/`, {}, {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Ocp-Apim-Subscription-Key': MOMO_PRIMARY_KEY
            }
        });
        
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting Momo access token:', error.response?.data || error.message);
        throw error;
    }
};

// Request payment from user
const requestPayment = async (amount, phoneNumber, externalId, paymentReason = 'Savings contribution') => {
    try {
        const token = await getAccessToken();
        
        const response = await axios.post(`${baseUrl}/collection/v1_0/requesttopay`, {
            amount: amount,
            currency: 'EUR',
            externalId: externalId,
            payer: {
                partyIdType: 'MSISDN',
                partyId: phoneNumber
            },
            payerMessage: paymentReason,
            payeeNote: paymentReason
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Reference-Id': externalId,
                'X-Target-Environment': MOMO_ENVIRONMENT === 'production' ? 'production' : 'sandbox',
                'Ocp-Apim-Subscription-Key': MOMO_PRIMARY_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error requesting Momo payment:', error.response?.data || error.message);
        throw error;
    }
};

// Check payment status
const checkPaymentStatus = async (referenceId) => {
    try {
        const token = await getAccessToken();
        
        const response = await axios.get(`${baseUrl}/collection/v1_0/requesttopay/${referenceId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Target-Environment': MOMO_ENVIRONMENT === 'production' ? 'production' : 'sandbox',
                'Ocp-Apim-Subscription-Key': MOMO_PRIMARY_KEY
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error checking Momo payment status:', error.response?.data || error.message);
        throw error;
    }
};

module.exports = {
    requestPayment,
    checkPaymentStatus
};