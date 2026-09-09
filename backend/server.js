// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// ==================== STATIC FILES ====================
// Images
app.use('/storage', express.static(path.join(__dirname, 'public/images')));
// Uploads (payment proofs)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ==================== MongoDB CONNECTION ====================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chefsetDB')
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ==================== ROUTES ====================

// Products Routes
app.use('/api/products', require('./routes/products'));

// About Routes
app.use('/api/about-header', require('./routes/aboutHeader'));
app.use('/api/about-story', require('./routes/aboutStory'));
app.use('/api/about-values', require('./routes/aboutValues'));
app.use('/api/about-why-choose-us', require('./routes/aboutWhyChooseUs'));
app.use('/api/about-achievement', require('./routes/aboutAchievement'));

// Navbar Route
app.use('/api/navbar', require('./routes/navbar'));

// Footer Route
app.use('/api/footer', require('./routes/footer'));

// FAQ Routes
app.use('/api/faq-header', require('./routes/faqHeader'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/faq-info', require('./routes/faqInfo'));

// Testimonials Route
app.use('/api/testimonials', require('./routes/testimonials'));

// Home Hero Route
app.use('/api/home-hero', require('./routes/homeHero'));

// Home Category Route
app.use('/api/home-category', require('./routes/homeCategory'));

// Home Product Route
app.use('/api/home-product', require('./routes/homeProduct'));

// Home Stats Route
app.use('/api/home-stats', require('./routes/homeStats'));

// Home Craft Route
app.use('/api/home-craft', require('./routes/homeCraft'));

// Contact Route
app.use('/api/contact', require('./routes/contact'));

// Newsletter Route
app.use('/api/newsletter', require('./routes/newsletter'));

// Contact Message Route
app.use('/api/contact-message', require('./routes/contactMessage'));

// Auth Route
app.use('/api/auth', require('./routes/auth'));

// Orders Route
app.use('/api/orders', require('./routes/orders'));

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message 
  });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    status: 'error'
  });
});

// ==================== SERVER START ====================
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Database: chefsetDB`);
  console.log(`📁 Storage: http://localhost:${PORT}/storage`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
  console.log(`📋 Routes:`);
  console.log(`   - /api/products`);
  console.log(`   - /api/about-header`);
  console.log(`   - /api/about-story`);
  console.log(`   - /api/about-values`);
  console.log(`   - /api/about-why-choose-us`);
  console.log(`   - /api/about-achievement`);
  console.log(`   - /api/navbar`);
  console.log(`   - /api/footer`);
  console.log(`   - /api/faq-header`);
  console.log(`   - /api/faqs`);
  console.log(`   - /api/faq-info`);
  console.log(`   - /api/testimonials`);
  console.log(`   - /api/home-hero`);
  console.log(`   - /api/home-category`);
  console.log(`   - /api/home-product`);
  console.log(`   - /api/home-stats`);
  console.log(`   - /api/home-craft`);
  console.log(`   - /api/contact`);
  console.log(`   - /api/newsletter`);
  console.log(`   - /api/contact-message`);
  console.log(`   - /api/auth`);
  console.log(`   - /api/orders`);
});