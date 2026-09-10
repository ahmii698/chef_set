// backend/routes/admin_contactMessage.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ContactMessage = require('../models/ContactMessage');
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
// ===== GET ALL MESSAGES (Admin) =====
// ============================================================
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    const totalMessages = messages.length;
    const unreadMessages = messages.filter(m => m.status === 'pending').length;
    const readMessages = messages.filter(m => m.status === 'read').length;
    const repliedMessages = messages.filter(m => m.status === 'replied').length;

    res.json({
      messages,
      stats: {
        totalMessages,
        unreadMessages,
        readMessages,
        repliedMessages
      }
    });
  } catch (error) {
    console.error('❌ Get messages error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== GET SINGLE MESSAGE (Admin) =====
// ============================================================
router.get('/:id', verifyAdmin, async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    console.error('❌ Get message error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== UPDATE STATUS (Admin) =====
// ============================================================
router.patch('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.status = status;
    await message.save();

    res.json({ 
      message: 'Status updated successfully!',
      data: message 
    });
  } catch (error) {
    console.error('❌ Update status error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== DELETE MESSAGE (Admin) =====
// ============================================================
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('❌ Delete message error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;