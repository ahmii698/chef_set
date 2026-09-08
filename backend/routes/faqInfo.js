// backend/routes/faqInfo.js
const express = require('express');
const router = express.Router();
const FaqInfo = require('../models/FaqInfo');

router.get('/', async (req, res) => {
  try {
    let data = await FaqInfo.findOne();
    if (!data) {
      data = new FaqInfo();
      await data.save();
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = new FaqInfo(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;