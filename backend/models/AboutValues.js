// backend/models/AboutValues.js
const mongoose = require('mongoose');

const aboutValuesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  values: {
    type: [{
      name: String,
      description: String,
      icon: String
    }],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AboutValues', aboutValuesSchema);