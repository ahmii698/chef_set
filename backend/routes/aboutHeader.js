// backend/routes/aboutHeader.js
const express = require('express');
const router = express.Router();
const AboutHeader = require('../models/AboutHeader');

// GET - Fetch About Header
router.get('/', async (req, res) => {
  try {
    const data = await AboutHeader.findOne();
    if (!data) return res.status(404).json({ message: 'Header not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Create About Header (agar pehle se nahi hai)
router.post('/', async (req, res) => {
  try {
    const data = new AboutHeader(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ PUT - Update About Header by ID (YEH NAYA ADD KIYA)
router.put('/:id', async (req, res) => {
  try {
    const updated = await AboutHeader.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Header not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;