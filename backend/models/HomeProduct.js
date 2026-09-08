// backend/models/HomeProduct.js
const mongoose = require('mongoose');

const homeProductSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'OUR PREMIUM COLLECTION'
  },
  subtitle: {
    type: String,
    default: 'EQUIPMENT FOR EVERY KITCHEN.'
  },
  products: {
    type: [{
      name: String,
      price: Number,
      image: String,
      link: String,
      buttonText: String,
      order: Number
    }],
    default: []
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

module.exports = mongoose.model('HomeProduct', homeProductSchema);