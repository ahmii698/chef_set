// backend/routes/aboutStory.js
const express = require('express');
const router = express.Router();
const AboutStory = require('../models/AboutStory');

// GET - Fetch About Story
router.get('/', async (req, res) => {
  try {
    const data = await AboutStory.findOne();
    if (!data) return res.status(404).json({ message: 'Story not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Create About Story (agar nahi hai)
router.post('/', async (req, res) => {
  try {
    const data = new AboutStory(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ PUT - Update About Story by ID (YEH NAYA ADD KIYA)
router.put('/:id', async (req, res) => {
  try {
    const updated = await AboutStory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Story not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;