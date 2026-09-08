// backend/routes/faqs.js
const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq');

// GET all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.find({ isActive: true }).sort({ order: 1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single FAQ
router.get('/:id', async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create FAQ
router.post('/', async (req, res) => {
  try {
    const faq = new Faq(req.body);
    const saved = await faq.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update FAQ
router.put('/:id', async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE FAQ
router.delete('/:id', async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;