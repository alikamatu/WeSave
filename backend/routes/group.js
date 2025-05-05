const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

// Create a new group
router.post('/', async (req, res) => {
  const { name, description, admin, members, targetAmount, contributionAmount, frequency, startDate, endDate } = req.body;

  if (!name || !admin || !targetAmount || !contributionAmount || !frequency || !startDate || !endDate) {
    return res.status(400).json({ message: 'All required fields must be provided.' });
  }

  const group = new Group({
    name,
    description,
    admin,
    members,
    targetAmount,
    contributionAmount,
    frequency,
    startDate,
    endDate,
  });

  try {
    const savedGroup = await group.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find().populate('admin members transactions chatMessages');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single group by ID
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('admin members transactions chatMessages');
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a group
router.put('/:id', async (req, res) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedGroup) return res.status(404).json({ message: 'Group not found' });
    res.json(updatedGroup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a group
router.delete('/:id', async (req, res) => {
  try {
    const deletedGroup = await Group.findByIdAndDelete(req.params.id);
    if (!deletedGroup) return res.status(404).json({ message: 'Group not found' });
    res.json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a member to a group
router.post('/:id/members', async (req, res) => {
  const { memberId } = req.body;

  if (!memberId) {
    return res.status(400).json({ message: 'Member ID is required.' });
  }

  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.members.includes(memberId)) {
      return res.status(400).json({ message: 'Member already exists in the group.' });
    }

    group.members.push(memberId);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a member from a group
router.delete('/:id/members/:memberId', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    group.members = group.members.filter((member) => member.toString() !== req.params.memberId);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;