// backend/routes/aboutAchievement.js
const express = require('express');
const router = express.Router();
const AboutAchievement = require('../models/AboutAchievement');

// GET - Fetch Achievements
router.get('/', async (req, res) => {
  try {
    const data = await AboutAchievement.findOne();
    if (!data) return res.status(404).json({ message: 'Achievements not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Create Achievements (agar nahi hai)
router.post('/', async (req, res) => {
  try {
    const data = new AboutAchievement(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ PUT - Update Achievements by ID (YEH NAYA ADD KIYA)
router.put('/:id', async (req, res) => {
  try {
    const updated = await AboutAchievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Achievements not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;