// backend/models/Product.js
const mongoose = require('mongoose');

const headerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    required: true
  },
  features: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('header', headerSchema);