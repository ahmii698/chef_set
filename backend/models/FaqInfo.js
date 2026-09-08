// backend/models/FaqInfo.js
const mongoose = require('mongoose');

const faqInfoSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'STILL HAVE QUESTIONS?'
  },
  description: {
    type: String,
    default: 'Our support team is ready to help you with any questions you have.'
  },
  contactInfo: {
    type: [{
      icon: String,
      label: String,
      value: String,
      subtext: String,
      link: String
    }],
    default: []
  },
  buttonText: {
    type: String,
    default: 'CONTACT US'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FaqInfo', faqInfoSchema);