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

// ==================== PUBLIC / USER ROUTES ====================

// Upload (image upload - admin panel ke liye)
app.use('/api/upload', require('./routes/upload'));

// Products
app.use('/api/products', require('./routes/products'));

// About
app.use('/api/about-header', require('./routes/aboutHeader'));
app.use('/api/about-story', require('./routes/aboutStory'));
app.use('/api/about-values', require('./routes/aboutValues'));
app.use('/api/about-why-choose-us', require('./routes/aboutWhyChooseUs'));
app.use('/api/about-achievement', require('./routes/aboutAchievement'));

// Navbar & Footer
app.use('/api/navbar', require('./routes/navbar'));
app.use('/api/footer', require('./routes/footer'));

// FAQ (Public - for website)
app.use('/api/faq-header', require('./routes/faqHeader'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/faq-info', require('./routes/faqInfo'));

// Testimonials (Public - for website)
app.use('/api/testimonials', require('./routes/testimonials'));

// Home Sections
app.use('/api/home-hero', require('./routes/homeHero'));
app.use('/api/home-category', require('./routes/homeCategory'));
app.use('/api/home-product', require('./routes/homeProduct'));
app.use('/api/home-stats', require('./routes/homeStats'));
app.use('/api/home-craft', require('./routes/homeCraft'));

// Contact & Newsletter (Public)
app.use('/api/contact', require('./routes/contact'));
app.use('/api/newsletter', require('./routes/newsletter'));

// Contact Message (Public - Website Form)
app.use('/api/contact-message', require('./routes/contactMessage'));

// User Orders
app.use('/api/orders', require('./routes/orders'));

// ==================== AUTH ROUTES ====================

// User Auth
app.use('/api/auth', require('./routes/auth'));

// Admin Auth
app.use('/api/admin-auth', require('./routes/adminAuth'));

// ==================== ADMIN ROUTES ====================

// ✅ NAYA - Admin Dashboard (stats, sales, recent orders, top products, subscribers)
app.use('/api/dashboard', require('./routes/dashboard'));

// Admin Products
app.use('/api/admin-products', require('./routes/adminProducts'));

// Admin Orders
app.use('/api/admin-orders', require('./routes/admin_order'));

// Admin Customers / Users View
app.use('/api/admin-users', require('./routes/admin_users_view'));

// Admin Testimonials
app.use('/api/admin-testimonials', require('./routes/adminTestimonials'));

// Admin FAQ
app.use('/api/admin-faq', require('./routes/adminFaq'));

// Admin Contact Messages
app.use('/api/admin-contact-messages', require('./routes/admin_contactMessage'));

// Admin Newsletter (Subscribe Us)
app.use('/api/admin-newsletter', require('./routes/admin_newsletter'));

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
  console.log(`\n📋 PUBLIC / USER ROUTES:`);
  console.log(`   - /api/upload                   ← Image Upload`);
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
  console.log(`   - /api/orders`);
  console.log(`\n🔐 AUTH ROUTES:`);
  console.log(`   - /api/auth`);
  console.log(`   - /api/admin-auth`);
  console.log(`\n🔒 ADMIN ROUTES:`);
  console.log(`   - /api/dashboard                ← Dashboard Stats/Graph`);
  console.log(`   - /api/admin-products`);
  console.log(`   - /api/admin-orders`);
  console.log(`   - /api/admin-users              ← Customers`);
  console.log(`   - /api/admin-testimonials       ← Testimonials`);
  console.log(`   - /api/admin-faq                ← FAQ`);
  console.log(`   - /api/admin-contact-messages   ← Contact Messages`);
  console.log(`   - /api/admin-newsletter         ← Subscribers`);
});