// backend/routes/faqHeader.js
const express = require('express');
const router = express.Router();
const FaqHeader = require('../models/FaqHeader');

router.get('/', async (req, res) => {
  try {
    let data = await FaqHeader.findOne();
    if (!data) {
      data = new FaqHeader({
        title: 'FAQ',
        subtitle: 'FREQUENTLY ASKED QUESTIONS',
        description: 'Find answers to the most common questions about ChefSet products, orders, shipping, and more.',
        image: 'faq-bg.jpg',
        searchPlaceholder: 'Search for answers...'
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
    const data = new FaqHeader(req.body);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;