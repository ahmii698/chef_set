// backend/models/HomeCategory.js
const mongoose = require('mongoose');

const homeCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  categories: {
    type: [{
      name: String,
      image: String,
      link: String,
      buttonText: String,
      order: Number
    }],
    required: true
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

module.exports = mongoose.model('HomeCategory', homeCategorySchema);