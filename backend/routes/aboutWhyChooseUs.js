// backend/routes/aboutWhyChooseUs.js
const express = require('express');
const router = express.Router();
const AboutWhyChooseUs = require('../models/AboutWhyChooseUs');

// GET - Fetch Why Choose Us
router.get('/', async (req, res) => {
  try {
    const data = await AboutWhyChooseUs.findOne();
    if (!data) return res.status(404).json({ message: 'Why choose us not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Create Why Choose Us (agar nahi hai)
router.post('/', async (req, res) => {
  try {
    const data = new AboutWhyChooseUs(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ PUT - Update Why Choose Us by ID (YEH NAYA ADD KIYA)
router.put('/:id', async (req, res) => {
  try {
    const updated = await AboutWhyChooseUs.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Why choose us not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;