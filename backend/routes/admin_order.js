// backend/routes/admin_order.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const User = require('../models/User');

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
// ===== GET ALL ORDERS WITH STATS (Admin) =====
// ============================================================
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    
    // Calculate stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

    res.json({
      orders,
      stats: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        processingOrders,
        shippedOrders,
        completedOrders,
        cancelledOrders
      }
    });
  } catch (error) {
    console.error('❌ Get admin orders error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== UPDATE ORDER STATUS (Admin) =====
// ============================================================
router.put('/:orderId/status', verifyAdmin, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    await order.save();

    res.json({ 
      message: 'Order status updated successfully!',
      order 
    });
  } catch (error) {
    console.error('❌ Update status error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== DELETE ORDER (Admin) =====
// ============================================================
router.delete('/:orderId', verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('❌ Delete order error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;