// backend/routes/aboutValues.js
const express = require('express');
const router = express.Router();
const AboutValues = require('../models/AboutValues');

router.get('/', async (req, res) => {
  try {
    const data = await AboutValues.findOne();
    if (!data) return res.status(404).json({ message: 'Values not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = new AboutValues(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;