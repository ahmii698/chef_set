// backend/routes/adminTestimonials.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Testimonial = require('../models/Testimonial');
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
// ===== GET ALL TESTIMONIALS (Admin) =====
// ============================================================
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    const totalTestimonials = testimonials.length;
    const activeTestimonials = testimonials.filter(t => t.isActive).length;
    const inactiveTestimonials = testimonials.filter(t => !t.isActive).length;

    res.json({
      testimonials,
      stats: {
        totalTestimonials,
        activeTestimonials,
        inactiveTestimonials
      }
    });
  } catch (error) {
    console.error('❌ Get testimonials error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== GET SINGLE TESTIMONIAL =====
// ============================================================
router.get('/:id', verifyAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json(testimonial);
  } catch (error) {
    console.error('❌ Get testimonial error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== CREATE TESTIMONIAL =====
// ============================================================
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, role, text, rating, isActive, order } = req.body;

    if (!name || !role || !text) {
      return res.status(400).json({ message: 'Name, role and text are required' });
    }

    const testimonial = new Testimonial({
      name: name.trim(),
      role: role.trim(),
      text: text.trim(),
      rating: Number(rating) || 5,
      isActive: isActive !== undefined ? isActive : true,
      order: Number(order) || 0
    });

    await testimonial.save();

    res.status(201).json({
      message: 'Testimonial created successfully!',
      testimonial
    });
  } catch (error) {
    console.error('❌ Create testimonial error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== UPDATE TESTIMONIAL =====
// ============================================================
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, role, text, rating, isActive, order } = req.body;

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    if (name !== undefined) testimonial.name = name.trim();
    if (role !== undefined) testimonial.role = role.trim();
    if (text !== undefined) testimonial.text = text.trim();
    if (rating !== undefined) testimonial.rating = Number(rating);
    if (isActive !== undefined) testimonial.isActive = isActive;
    if (order !== undefined) testimonial.order = Number(order);

    await testimonial.save();

    res.json({
      message: 'Testimonial updated successfully!',
      testimonial
    });
  } catch (error) {
    console.error('❌ Update testimonial error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== TOGGLE ACTIVE STATUS =====
// ============================================================
router.patch('/:id/toggle', verifyAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();

    res.json({
      message: `Testimonial ${testimonial.isActive ? 'activated' : 'deactivated'} successfully!`,
      testimonial
    });
  } catch (error) {
    console.error('❌ Toggle testimonial error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== DELETE TESTIMONIAL =====
// ============================================================
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('❌ Delete testimonial error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;