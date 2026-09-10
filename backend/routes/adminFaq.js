// backend/routes/adminFaq.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Faq = require('../models/Faq');
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
// ===== GET ALL FAQs (Admin) =====
// ============================================================
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ order: 1, createdAt: -1 });

    const totalFaqs = faqs.length;
    const activeFaqs = faqs.filter(f => f.isActive).length;
    const inactiveFaqs = faqs.filter(f => !f.isActive).length;

    res.json({
      faqs,
      stats: {
        totalFaqs,
        activeFaqs,
        inactiveFaqs
      }
    });
  } catch (error) {
    console.error('❌ Get FAQs error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== CREATE FAQ =====
// ============================================================
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { question, answer, isActive, order, category } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const faq = new Faq({
      question: question.trim(),
      answer: answer.trim(),
      isActive: isActive !== undefined ? isActive : true,
      order: Number(order) || 0,
      category: category || 'General'
    });

    await faq.save();

    res.status(201).json({
      message: 'FAQ created successfully!',
      faq
    });
  } catch (error) {
    console.error('❌ Create FAQ error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== UPDATE FAQ =====
// ============================================================
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { question, answer, isActive, order, category } = req.body;

    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    if (question !== undefined) faq.question = question.trim();
    if (answer !== undefined) faq.answer = answer.trim();
    if (isActive !== undefined) faq.isActive = isActive;
    if (order !== undefined) faq.order = Number(order);
    if (category !== undefined) faq.category = category;

    await faq.save();

    res.json({
      message: 'FAQ updated successfully!',
      faq
    });
  } catch (error) {
    console.error('❌ Update FAQ error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== TOGGLE ACTIVE STATUS =====
// ============================================================
router.patch('/:id/toggle', verifyAdmin, async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    faq.isActive = !faq.isActive;
    await faq.save();

    res.json({
      message: `FAQ ${faq.isActive ? 'activated' : 'deactivated'} successfully!`,
      faq
    });
  } catch (error) {
    console.error('❌ Toggle FAQ error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== UPDATE ORDER =====
// ============================================================
router.patch('/:id/order', verifyAdmin, async (req, res) => {
  try {
    const { order } = req.body;
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    faq.order = Number(order) || 0;
    await faq.save();

    res.json({
      message: 'Order updated successfully!',
      faq
    });
  } catch (error) {
    console.error('❌ Update order error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== DELETE FAQ =====
// ============================================================
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('❌ Delete FAQ error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;