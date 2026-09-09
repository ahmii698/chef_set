// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  resetOTP: {
    type: String,
    default: null
  },
  resetOTPExpires: {
    type: Date,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // ✅ Role field - admin/user differentiate karne ke liye
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // ✅ Phone number (optional)
  phone: {
    type: String,
    default: ''
  },
  // ✅ Profile image (optional)
  profileImage: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ HASH PASSWORD - Static method
userSchema.statics.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// ✅ COMPARE PASSWORD
userSchema.methods.comparePasswordAsync = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ✅ TO JSON - Remove sensitive fields
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetOTP;
  delete obj.resetOTPExpires;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);