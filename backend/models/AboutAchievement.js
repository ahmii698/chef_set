// backend/models/AboutAchievement.js
const mongoose = require('mongoose');

const aboutAchievementSchema = new mongoose.Schema({
  achievements: {
    type: [{
      number: String,
      label: String,
      icon: String
    }],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AboutAchievement', aboutAchievementSchema);