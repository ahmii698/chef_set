// backend/routes/footer.js
const express = require('express');
const router = express.Router();
const Footer = require('../models/Footer');

// GET footer data
router.get('/', async (req, res) => {
  try {
    let data = await Footer.findOne();
    if (!data) {
      data = new Footer();
      await data.save();
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create footer
router.post('/', async (req, res) => {
  try {
    const data = new Footer(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update footer
router.put('/:id', async (req, res) => {
  try {
    const data = await Footer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!data) return res.status(404).json({ message: 'Footer not found' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;