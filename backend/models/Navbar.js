// backend/models/Navbar.js
const mongoose = require('mongoose');

const navbarSchema = new mongoose.Schema({
  logo: {
    type: String,
    default: ''  // Agar empty hai toh text dikhega
  },
  brandText: {
    type: String,
    default: 'CHEFSET'
  },
  tagline: {
    type: String,
    default: 'Built for the Serious Chef'
  },
  menuItems: {
    type: [{
      name: String,
      link: String,
      order: Number
    }],
    default: [
      { name: 'HOME', link: '/', order: 1 },
      { name: 'ABOUT', link: '/about', order: 2 },
      { name: 'SHOP', link: '/products', order: 3 },
      { name: 'FAQ', link: '/faq', order: 4 },
      { name: 'CONTACT', link: '/contact', order: 5 }
    ]
  },
  trackOrderText: {
    type: String,
    default: 'TRACK ORDER'
  },
  searchPlaceholder: {
    type: String,
    default: 'Search for premium kitchen equipment...'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Navbar', navbarSchema);