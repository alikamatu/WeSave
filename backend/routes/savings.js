const express = require('express');
const router = express.Router();
const SavingsPlan = require('../models/SavingsPlan');
const { savingsPlanValidation } = require('../utils/validation');

// Create a new savings plan
router.post('/', async (req, res) => {
    // Validate data
    const { error } = savingsPlanValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Create savings plan
    const savingsPlan = new SavingsPlan({
        userId: req.user.id,
        name: req.body.name,
        targetAmount: req.body.targetAmount,
        frequency: req.body.frequency,
        contributionAmount: req.body.contributionAmount,
        withdrawalLimit: req.body.withdrawalLimit,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    });

    try {
        const savedPlan = await savingsPlan.save();
        res.json(savedPlan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all savings plans for user
router.get('/', async (req, res) => {
    try {
        const savingsPlans = await SavingsPlan.find({ userId: req.user.id });
        res.json(savingsPlans);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get single savings plan
router.get('/:id', async (req, res) => {
    try {
        const savingsPlan = await SavingsPlan.findOne({
            _id: req.params.id,
            userId: req.user.id
        }).populate('transactions');
        
        if (!savingsPlan) return res.status(404).json({ message: 'Savings plan not found' });
        
        res.json(savingsPlan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update savings plan
router.put('/:id', async (req, res) => {
    try {
        const updatedPlan = await SavingsPlan.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        
        if (!updatedPlan) return res.status(404).json({ message: 'Savings plan not found' });
        
        res.json(updatedPlan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete savings plan
router.delete('/:id', async (req, res) => {
    try {
        const deletedPlan = await SavingsPlan.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!deletedPlan) return res.status(404).json({ message: 'Savings plan not found' });
        
        res.json({ message: 'Savings plan deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;