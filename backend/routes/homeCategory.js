// backend/routes/homeCategory.js
const express = require('express');
const router = express.Router();
const HomeCategory = require('../models/HomeCategory');

// GET home category data
router.get('/', async (req, res) => {
  try {
    let data = await HomeCategory.findOne({ isActive: true });
    if (!data) {
      data = new HomeCategory({
        title: 'SHOP BY CATEGORY',
        subtitle: 'COLLECTIONS',
        categories: [
          { name: 'Cookware', image: 'cookware.jpg', link: '/products?category=cookware', buttonText: 'SHOP NOW', order: 1 },
          { name: 'Utensils', image: 'utensils.jpg', link: '/products?category=utensils', buttonText: 'SHOP NOW', order: 2 },
          { name: 'Storage', image: 'storage.jpg', link: '/products?category=storage', buttonText: 'SHOP NOW', order: 3 }
        ]
      });
      await data.save();
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create home category
router.post('/', async (req, res) => {
  try {
    const data = new HomeCategory(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update home category
router.put('/:id', async (req, res) => {
  try {
    const data = await HomeCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!data) return res.status(404).json({ message: 'HomeCategory not found' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;