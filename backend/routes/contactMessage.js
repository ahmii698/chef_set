// backend/routes/contactMessage.js
const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

// GET all messages (admin)
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    const newMessage = new ContactMessage({
      name,
      email,
      subject,
      message
    });

    const saved = await newMessage.save();
    res.status(201).json({ 
      message: 'Message sent successfully! 🎉',
      data: saved 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update message status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE message
router.delete('/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;