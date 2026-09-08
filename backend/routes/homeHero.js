// backend/routes/homeHero.js
const express = require('express');
const router = express.Router();
const HomeHero = require('../models/HomeHero');

// GET home hero data
router.get('/', async (req, res) => {
  try {
    let data = await HomeHero.findOne({ isActive: true });
    if (!data) {
      // Default data create karo
      data = new HomeHero({
        title: 'BUILT FOR THE SERIOUS',
        subtitle: 'CHEF.',
        description: 'Premium kitchen equipment designed for precision, performance, and everyday professional cooking.',
        image: 'hero-bg.jpg',
        primaryButton: {
          text: 'EXPLORE PRODUCTS',
          link: '/products'
        },
        secondaryButton: {
          text: 'DISCOVER CRAFT',
          link: '/about'
        }
      });
      await data.save();
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create home hero
router.post('/', async (req, res) => {
  try {
    const data = new HomeHero(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update home hero
router.put('/:id', async (req, res) => {
  try {
    const data = await HomeHero.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!data) return res.status(404).json({ message: 'HomeHero not found' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;