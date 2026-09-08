// backend/routes/homeStats.js
const express = require('express');
const router = express.Router();
const HomeStats = require('../models/HomeStats');

router.get('/', async (req, res) => {
  try {
    let data = await HomeStats.findOne({ isActive: true });
    if (!data) {
      data = new HomeStats({
        stats: [
          { number: '150+', label: 'PREMIUM PRODUCTS', icon: 'products', order: 1 },
          { number: '10,000+', label: 'HAPPY CUSTOMERS', icon: 'customers', order: 2 },
          { number: '25+', label: 'YEARS OF TRUST', icon: 'trust', order: 3 },
          { number: '100%', label: 'QUALITY GUARANTEE', icon: 'quality', order: 4 }
        ]
      });
      await data.save();
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = new HomeStats(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await HomeStats.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!data) return res.status(404).json({ message: 'HomeStats not found' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;