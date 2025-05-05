const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const Group = require('../models/Group');

// Get all chat messages for a group
router.get('/:groupId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ groupId: req.params.groupId })
      .populate('sender', 'firstName lastName email') // Populate sender details
      .sort({ createdAt: 1 }); // Sort messages by creation time
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send a new chat message
router.post('/:groupId', async (req, res) => {
  const { sender, message } = req.body;

  if (!sender || !message) {
    return res.status(400).json({ message: 'Sender and message are required.' });
  }

  try {
    // Ensure the group exists
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    const chatMessage = new ChatMessage({
      groupId: req.params.groupId,
      sender,
      message,
    });

    const savedMessage = await chatMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;