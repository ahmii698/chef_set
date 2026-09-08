// backend/models/FaqHeader.js
const mongoose = require('mongoose');

const faqHeaderSchema = new mongoose.Schema({
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
  searchPlaceholder: {
    type: String,
    default: 'Search for answers...'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FaqHeader', faqHeaderSchema);