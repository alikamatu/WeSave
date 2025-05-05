const express = require('express');
const router = express.Router();
const SavingsPlan = require('../models/SavingsPlan');

router.post('/', async (req, res) => {
  const { userId, name, targetAmount, frequency, contributionAmount, withdrawalLimit, startDate, endDate } = req.body;

  if (!userId || !name || !targetAmount || !frequency || !contributionAmount || !withdrawalLimit || !startDate || !endDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const savingsPlan = new SavingsPlan({
    userId,
    name,
    targetAmount,
    frequency,
    contributionAmount,
    withdrawalLimit,
    startDate,
    endDate,
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