// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  zipcode: {
    type: String,
    default: ''
  },
  paymentMethod: {
    type: String,
    default: 'Bank Transfer'
  },
  notes: {
    type: String,
    default: ''
  },
  items: {
    type: [{
      id: String,
      name: String,
      price: Number,
      qty: Number,
      image: String
    }],
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  // ✅ Order Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  // ✅ Payment Status
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  // ✅ Payment Proof (screenshot path)
  paymentProof: {
    type: String,
    default: null
  },
  // ✅ User ID (reference to User model)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);