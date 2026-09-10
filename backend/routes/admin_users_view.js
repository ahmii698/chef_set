// backend/routes/admin_users_view.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');

// ============================================================
// ===== CONFIG =====
// ============================================================
const INACTIVE_DAYS = 60; // ✅ 60 din tak order na kare toh inactive

// ============================================================
// ===== HELPER: Calculate Customer Status =====
// ============================================================
const calculateStatus = (totalOrders, lastOrderDate) => {
  // Agar koi order nahi kiya → Inactive
  if (totalOrders === 0 || !lastOrderDate) {
    return 'Inactive';
  }

  // Check last order date
  const now = new Date();
  const lastOrder = new Date(lastOrderDate);
  const daysDiff = Math.floor((now - lastOrder) / (1000 * 60 * 60 * 24));

  // Agar last order 60 din se purana → Inactive
  if (daysDiff > INACTIVE_DAYS) {
    return 'Inactive';
  }

  // Warna Active
  return 'Active';
};

// ============================================================
// ===== ADMIN MIDDLEWARE =====
// ============================================================
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ============================================================
// ===== GET ALL CUSTOMERS WITH STATS (Admin) =====
// ============================================================
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    // Get all users (excluding admins)
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password -resetOTP -resetOTPExpires')
      .sort({ createdAt: -1 });

    // Get all orders (sorted by newest first)
    const allOrders = await Order.find().sort({ createdAt: -1 });

    // Build customer data with order stats
    const customers = users.map(user => {
      // Filter orders for this user by email or userId
      const userOrders = allOrders.filter(o => 
        o.email?.toLowerCase() === user.email?.toLowerCase() ||
        (o.userId && o.userId.toString() === user._id.toString())
      );

      const totalOrders = userOrders.length;
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      
      // ✅ Last order date (orders are sorted desc, so first is latest)
      const lastOrderDate = userOrders.length > 0 
        ? userOrders[0].createdAt 
        : null;

      // ✅ Calculate status based on 60-day rule
      const status = calculateStatus(totalOrders, lastOrderDate);

      return {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || 'N/A',
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        totalOrders,
        totalSpent,
        lastOrderDate,
        status
      };
    });

    // Calculate stats
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'Active').length;
    const inactiveCustomers = customers.filter(c => c.status === 'Inactive').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

    res.json({
      customers,
      stats: {
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('❌ Get admin customers error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== GET SINGLE CUSTOMER DETAILS (Admin) =====
// ============================================================
router.get('/:userId', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -resetOTP -resetOTPExpires');

    if (!user) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Get user's orders (sorted newest first)
    const orders = await Order.find({
      $or: [
        { email: user.email },
        { userId: user._id }
      ]
    }).sort({ createdAt: -1 });

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    // ✅ Last order date
    const lastOrderDate = orders.length > 0 ? orders[0].createdAt : null;

    // ✅ Calculate status with 60-day rule
    const status = calculateStatus(totalOrders, lastOrderDate);

    res.json({
      customer: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || 'N/A',
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        totalOrders,
        totalSpent,
        lastOrderDate,
        status
      },
      orders
    });
  } catch (error) {
    console.error('❌ Get customer error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== DELETE CUSTOMER (Admin) =====
// ============================================================
router.delete('/:userId', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Don't allow deleting admins
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin accounts' });
    }

    await User.findByIdAndDelete(req.params.userId);

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('❌ Delete customer error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;