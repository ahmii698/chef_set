// backend/routes/newsletter.js
const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// GET all subscribers
router.get('/', async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({ message: 'Email already subscribed' });
      } else {
        // Reactivate
        existing.isActive = true;
        await existing.save();
        return res.json({ message: 'Subscription reactivated successfully', email });
      }
    }

    // New subscription
    const subscription = new Newsletter({ email });
    await subscription.save();
    
    res.status(201).json({ message: 'Subscribed successfully!', email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE unsubscribe
router.delete('/unsubscribe/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const subscription = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (!subscription) {
      return res.status(404).json({ message: 'Email not found' });
    }
    
    subscription.isActive = false;
    await subscription.save();
    
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;