// backend/models/Footer.js
const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  brand: {
    name: {
      type: String,
      default: 'CHEFSET'
    },
    tagline: {
      type: String,
      default: 'Built for the Serious Chef'
    },
    description: {
      type: String,
      default: 'Top-quality kitchen equipment trusted by professionals worldwide.'
    },
    logo: {
      type: String,
      default: ''
    }
  },
  quickLinks: {
    title: {
      type: String,
      default: 'QUICK LINKS'
    },
    links: {
      type: [{
        name: String,
        link: String,
        order: Number
      }],
      default: [
        { name: 'Home', link: '/', order: 1 },
        { name: 'Products', link: '/products', order: 2 },
        { name: 'About Us', link: '/about', order: 3 },
        { name: 'Testimonials', link: '/testimonials', order: 4 },
        { name: 'Contact', link: '/contact', order: 5 },
        { name: 'Billing', link: '/billing', order: 6 }
      ]
    }
  },
  categories: {
    title: {
      type: String,
      default: 'CATEGORIES'
    },
    links: {
      type: [{
        name: String,
        link: String,
        order: Number
      }],
      default: [
        { name: 'Cookware', link: '/products?category=cookware', order: 1 },
        { name: 'Knives', link: '/products?category=knives', order: 2 },
        { name: 'Appliances', link: '/products?category=appliances', order: 3 },
        { name: 'Accessories', link: '/products?category=accessories', order: 4 },
        { name: 'Storage', link: '/products?category=storage', order: 5 },
        { name: 'New Arrivals', link: '/products?category=new-arrivals', order: 6 }
      ]
    }
  },
  support: {
    title: {
      type: String,
      default: 'SUPPORT'
    },
    links: {
      type: [{
        name: String,
        link: String,
        order: Number
      }],
      default: [
        { name: 'FAQ', link: '/faq', order: 1 },
        { name: 'Shipping & Delivery', link: '/shipping', order: 2 },
        { name: 'Returns & Refunds', link: '/returns', order: 3 },
        { name: 'Warranty', link: '/warranty', order: 4 },
        { name: 'Track Order', link: '/trackorder', order: 5 }
      ]
    }
  },
  contact: {
    title: {
      type: String,
      default: 'GET IN TOUCH'
    },
    email: {
      type: String,
      default: 'info@chefset.com'
    },
    phone: {
      type: String,
      default: '+1 (555) 123-4567'
    },
    address: {
      type: String,
      default: '123 Chef Street, New York, NY 10001'
    },
    socialLinks: {
      type: [{
        platform: String,
        url: String,
        icon: String
      }],
      default: []
    }
  },
  newsletter: {
    title: {
      type: String,
      default: 'STAY UPDATED'
    },
    description: {
      type: String,
      default: 'Subscribe to our newsletter and never miss our latest offers.'
    },
    placeholder: {
      type: String,
      default: 'Enter your email'
    },
    buttonText: {
      type: String,
      default: 'Subscribe'
    }
  },
  copyright: {
    type: String,
    default: '© 2026 CHEFSET. All rights reserved.'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Footer', footerSchema);