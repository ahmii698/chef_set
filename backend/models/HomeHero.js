// backend/models/HomeHero.js
const mongoose = require('mongoose');

const homeHeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  primaryButton: {
    text: {
      type: String,
      default: 'EXPLORE PRODUCTS'
    },
    link: {
      type: String,
      default: '/products'
    }
  },
  secondaryButton: {
    text: {
      type: String,
      default: 'DISCOVER CRAFT'
    },
    link: {
      type: String,
      default: '/about'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HomeHero', homeHeroSchema);