// backend/routes/admin_newsletter.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Newsletter = require('../models/Newsletter');
const User = require('../models/User');

// ============================================================
// ===== ADMIN MIDDLEWARE =====
// ============================================================
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ============================================================
// ===== GET ALL SUBSCRIBERS =====
// ============================================================
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1, createdAt: -1 });

    const totalSubscribers = subscribers.length;
    const activeSubscribers = subscribers.filter(s => s.isActive).length;

    res.json({
      subscribers,
      stats: {
        totalSubscribers,
        activeSubscribers
      }
    });
  } catch (error) {
    console.error('❌ Get subscribers error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== DELETE SUBSCRIBER =====
// ============================================================
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('❌ Delete subscriber error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;