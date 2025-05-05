const express = require('express');
const router = express.Router();
const axios = require('axios'); // Use Axios for making requests to MTN MoMo API

router.post('/mtn-momo', async (req, res) => {
  const { planId, amount, phoneNumber } = req.body;

  if (!planId || !amount || !phoneNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Replace with your MTN MoMo API credentials and endpoint
    const momoApiUrl = 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay';
    const apiKey = 'YOUR_MTN_MOMO_API_KEY';
    const subscriptionKey = 'YOUR_MTN_MOMO_SUBSCRIPTION_KEY';

    const response = await axios.post(
      momoApiUrl,
      {
        amount,
        currency: 'UGX', // Replace with your currency
        externalId: planId,
        payer: {
          partyIdType: 'MSISDN',
          partyId: phoneNumber,
        },
        payerMessage: 'Savings Plan Contribution',
        payeeNote: 'Savings Plan Payment',
      },
      {
        headers: {
          'X-Reference-Id': planId,
          'X-Target-Environment': 'sandbox', // Use 'production' for live
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    res.json({ message: 'Payment processed successfully', data: response.data });
  } catch (error) {
    console.error('Error processing payment:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to process payment' });
  }
});

module.exports = router;