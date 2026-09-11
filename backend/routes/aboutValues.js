// backend/routes/aboutValues.js
const express = require('express');
const router = express.Router();
const AboutValues = require('../models/AboutValues');

// GET - Fetch About Values
router.get('/', async (req, res) => {
  try {
    const data = await AboutValues.findOne();
    if (!data) return res.status(404).json({ message: 'Values not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Create About Values (agar nahi hai)
router.post('/', async (req, res) => {
  try {
    const data = new AboutValues(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ PUT - Update About Values by ID (YEH NAYA ADD KIYA)
router.put('/:id', async (req, res) => {
  try {
    const updated = await AboutValues.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Values not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;