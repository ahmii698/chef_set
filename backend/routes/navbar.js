// backend/routes/navbar.js
const express = require('express');
const router = express.Router();
const Navbar = require('../models/Navbar');

// GET navbar data
router.get('/', async (req, res) => {
  try {
    let data = await Navbar.findOne();
    if (!data) {
      // Default data create karo agar nahi hai toh
      data = new Navbar();
      await data.save();
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create navbar
router.post('/', async (req, res) => {
  try {
    const data = new Navbar(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update navbar
router.put('/:id', async (req, res) => {
  try {
    const data = await Navbar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!data) return res.status(404).json({ message: 'Navbar not found' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;