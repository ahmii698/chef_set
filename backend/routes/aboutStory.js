// backend/routes/aboutStory.js
const express = require('express');
const router = express.Router();
const AboutStory = require('../models/AboutStory');

router.get('/', async (req, res) => {
  try {
    const data = await AboutStory.findOne();
    if (!data) return res.status(404).json({ message: 'Story not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = new AboutStory(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;