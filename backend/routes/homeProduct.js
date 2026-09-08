// backend/routes/homeProduct.js
const express = require('express');
const router = express.Router();
const HomeProduct = require('../models/HomeProduct');

router.get('/', async (req, res) => {
  try {
    let data = await HomeProduct.findOne({ isActive: true });
    if (!data) {
      data = new HomeProduct({
        title: 'OUR PREMIUM COLLECTION',
        subtitle: 'EQUIPMENT FOR EVERY KITCHEN.',
        products: [
          { name: 'Professional Chef Knife', price: 8500, image: 'cs1.jpg', link: '/product/1', buttonText: 'View Details', order: 1 },
          { name: 'Stainless Steel Cookware', price: 24000, image: 'cs2.jpg', link: '/product/2', buttonText: 'View Details', order: 2 },
          { name: 'Cast Iron Grill Pan', price: 6900, image: 'cs3.jpg', link: '/product/3', buttonText: 'View Details', order: 3 },
          { name: 'Professional Mixing Bowl', price: 3200, image: 'cs4.jpg', link: '/product/4', buttonText: 'View Details', order: 4 }
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
    const data = new HomeProduct(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await HomeProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!data) return res.status(404).json({ message: 'HomeProduct not found' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;