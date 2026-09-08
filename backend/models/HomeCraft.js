// backend/models/HomeCraft.js
const mongoose = require('mongoose');

const homeCraftSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'TOOLS THAT ELEVATE YOUR CRAFT.'
  },
  description: {
    type: String,
    default: 'Challenging and professional-grade quality is your top priority. Every product is crafted for durability, stability, and superior performance.'
  },
  buttonText: {
    type: String,
    default: 'Learn More'
  },
  buttonLink: {
    type: String,
    default: '/about'
  },
  features: {
    type: [{
      title: String,
      description: String,
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

module.exports = mongoose.model('HomeCraft', homeCraftSchema);