// backend/models/AboutWhyChooseUs.js
const mongoose = require('mongoose');

const aboutWhyChooseUsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  points: {
    type: [String],
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

module.exports = mongoose.model('AboutWhyChooseUs', aboutWhyChooseUsSchema);