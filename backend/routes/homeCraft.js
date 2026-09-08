// backend/routes/homeCraft.js
const express = require('express');
const router = express.Router();
const HomeCraft = require('../models/HomeCraft');

router.get('/', async (req, res) => {
  try {
    let data = await HomeCraft.findOne({ isActive: true });
    if (!data) {
      data = new HomeCraft({
        title: 'TOOLS THAT ELEVATE YOUR CRAFT.',
        description: 'Challenging and professional-grade quality is your top priority. Every product is crafted for durability, stability, and superior performance.',
        buttonText: 'Learn More',
        buttonLink: '/about',
        features: [
          {
            title: 'PROFESSIONAL QUALITY',
            description: 'Designed with precision to protect balance and safety',
            icon: 'quality',
            order: 1
          },
          {
            title: 'PRICE COMPARISON',
            description: 'Double and reduce risk for every professional',
            icon: 'price',
            order: 2
          },
          {
            title: 'SAFETY FIRST',
            description: 'Engineered with utmost safety and durability',
            icon: 'safety',
            order: 3
          },
          {
            title: 'INDUSTRIAL GRADE',
            description: 'Premium materials for long-lasting performance',
            icon: 'industrial',
            order: 4
          }
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
    const data = new HomeCraft(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await HomeCraft.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!data) return res.status(404).json({ message: 'HomeCraft not found' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;