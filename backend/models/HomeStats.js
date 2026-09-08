// backend/models/HomeStats.js
const mongoose = require('mongoose');

const homeStatsSchema = new mongoose.Schema({
  stats: {
    type: [{
      number: String,
      label: String,
      icon: String,
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

module.exports = mongoose.model('HomeStats', homeStatsSchema);