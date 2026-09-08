// backend/models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'CONTACT US'
  },
  subtitle: {
    type: String,
    default: "WE'D LOVE TO HEAR FROM YOU."
  },
  description: {
    type: String,
    default: 'Fill out the form below and we\'ll reply to you soon.'
  },
  formTitle: {
    type: String,
    default: 'SEND US A MESSAGE'
  },
  formSubtitle: {
    type: String,
    default: 'Have a question or need assistance? Contact our team and we\'ll get back to you as soon as possible.'
  },
  contactInfo: {
    type: [{
      icon: String,
      label: String,
      value: String,
      link: String,
      order: Number
    }],
    default: []
  },
  businessHours: {
    type: String,
    default: 'Mon - Fri: 9:00 AM - 6:00 PM\nSat - Sun: Closed'
  },
  buttonText: {
    type: String,
    default: 'SEND MESSAGE'
  },
  footerText: {
    type: String,
    default: 'Your information is safe with us. We never share your data.'
  },
  benefits: {
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

module.exports = mongoose.model('Contact', contactSchema);