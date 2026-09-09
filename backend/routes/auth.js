// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../config/email');

// ===== TEST ROUTE =====
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route is working!' });
});

// ===== REGISTER =====
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await User.hashPassword(password);
    const user = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully! Please login.' });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== LOGIN =====
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePasswordAsync(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== CHANGE PASSWORD (Profile se) =====
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePasswordAsync(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await User.hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('❌ Change password error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== FORGOT PASSWORD - SEND OTP =====
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndUpdate(
      { email: email.toLowerCase() },
      { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      { upsert: true }
    );

    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPEmail(email, otp);

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== VERIFY OTP =====
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.resetOTP !== otp || user.resetOTPExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.resetOTP = null;
    user.resetOTPExpires = null;
    await user.save();

    await OTP.findOneAndDelete({ email: email.toLowerCase() });

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== RESET PASSWORD (Forgot password se) =====
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await User.hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successfully! Please login.' });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== VERIFY TOKEN =====
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password -resetOTP -resetOTPExpires');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;