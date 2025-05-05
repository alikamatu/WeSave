const express = require('express');
const router = express.Router();
const SavingsPlan = require('../models/SavingsPlan');

// Create a new savings plan
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

// Get all savings plans
router.get('/', async (req, res) => {
  try {
    const savingsPlans = await SavingsPlan.find();
    res.json(savingsPlans);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single savings plan by ID
router.get('/:id', async (req, res) => {
  try {
    const savingsPlan = await SavingsPlan.findById(req.params.id).populate('transactions');

    if (!savingsPlan) return res.status(404).json({ message: 'Savings plan not found' });

    res.json(savingsPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a savings plan
router.put('/:id', async (req, res) => {
  try {
    const updatedPlan = await SavingsPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedPlan) return res.status(404).json({ message: 'Savings plan not found' });

    res.json(updatedPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedPlan = await SavingsPlan.findByIdAndDelete(req.params.id);

    if (!deletedPlan) return res.status(404).json({ message: 'Savings plan not found' });

    res.json({ message: 'Savings plan deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;