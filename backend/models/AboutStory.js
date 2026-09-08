// backend/models/AboutStory.js
const mongoose = require('mongoose');

const aboutStorySchema = new mongoose.Schema({
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
  missionTitle: {
    type: String,
    required: true
  },
  missionSubtitle: {
    type: String,
    required: true
  },
  missionDescription: {
    type: String,
    required: true
  },
  missionPoints: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AboutStory', aboutStorySchema);