// backend/models/AboutHeader.js
const mongoose = require('mongoose');

const aboutHeaderSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true
  },
  subheading: {
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AboutHeader', aboutHeaderSchema);