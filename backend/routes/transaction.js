const express = require('express');
const router = express.Router();
// const auth = require('../middlewares/auth');
const Transaction = require('../models/Transaction');
const SavingsPlan = require('../models/SavingsPlan');
const Group = require('../models/Group');
const momoService = require('../services/momoService');

// Initiate payment
router.post('/initiate', async (req, res) => {
    try {
        const { planId, amount, phoneNumber, paymentMethod } = req.body;
        
        // Validate payment method
        if (paymentMethod !== 'momo') {
            return res.status(400).json({ message: 'Only MTN Mobile Money is supported' });
        }
        
        // Generate a unique reference ID
        const referenceId = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Create transaction record
        const transaction = new Transaction({
            userId: req.user.id,
            planId,
            amount,
            paymentMethod,
            referenceId,
            status: 'PENDING'
        });
        
        await transaction.save();
        
        // Initiate Momo payment
        const paymentResponse = await momoService.requestPayment(
            amount,
            phoneNumber,
            referenceId,
            'Savings contribution'
        );
        
        // Update savings plan or group with the transaction
        if (planId) {
            await SavingsPlan.findByIdAndUpdate(planId, {
                $push: { transactions: transaction._id }
            });
        }
        
        res.json({
            message: 'Payment initiated',
            referenceId,
            transactionId: transaction._id
        });
    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({ message: 'Payment initiation failed', error: error.message });
    }
});

// Check payment status
router.get('/status/:referenceId', async (req, res) => {
    try {
        const { referenceId } = req.params;
        
        // Check in our database first
        const transaction = await Transaction.findOne({ referenceId });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        
        // If already completed in our DB, return that status
        if (transaction.status === 'SUCCESSFUL' || transaction.status === 'FAILED') {
            return res.json({ status: transaction.status });
        }
        
        // Check with Momo API
        const momoStatus = await momoService.checkPaymentStatus(referenceId);
        
        // Update our transaction record
        transaction.status = momoStatus.status;
        await transaction.save();
        
        // If payment was successful, update the savings plan or group
        if (momoStatus.status === 'SUCCESSFUL') {
            if (transaction.planId) {
                await SavingsPlan.findByIdAndUpdate(transaction.planId, {
                    $inc: { currentAmount: transaction.amount }
                });
            }
        }
        
        res.json({ status: momoStatus.status });
    } catch (error) {
        console.error('Payment status check error:', error);
        res.status(500).json({ message: 'Payment status check failed', error: error.message });
    }
});

// Get all transactions for user
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
    }
});

module.exports = router;