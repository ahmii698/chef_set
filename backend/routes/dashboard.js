// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Newsletter = require('../models/Newsletter');

// ==================== HELPER: Get Date Range ====================
const getDateRange = (range, startDate, endDate, specificDate) => {
  const now = new Date();
  let start = new Date();
  let end = new Date();
  end.setHours(23, 59, 59, 999);

  if (range === 'daily') {
    start.setHours(0, 0, 0, 0);
  } else if (range === 'weekly') {
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  } else if (range === 'monthly') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
  } else if (range === 'yearly') {
    start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    start.setHours(0, 0, 0, 0);
  } else if (range === 'custom' && startDate && endDate) {
    start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
  } else if (range === 'specific' && specificDate) {
    start = new Date(specificDate);
    start.setHours(0, 0, 0, 0);
    end = new Date(specificDate);
    end.setHours(23, 59, 59, 999);
  }

  return { start, end };
};

// ==================== GET /api/dashboard/stats ====================
// ✅ Ab saare 4 metrics filter ke hisaab se aayenge
router.get('/stats', async (req, res) => {
  try {
    const { range = 'all', startDate, endDate, specificDate } = req.query;

    let orderMatch = { status: { $nin: ['cancelled'] } };
    let dateFilter = null;

    if (range !== 'all') {
      const { start, end } = getDateRange(range, startDate, endDate, specificDate);
      dateFilter = { $gte: start, $lte: end };
      orderMatch.createdAt = dateFilter;
    }

    // 1. Total Revenue (filtered orders)
    const revenueResult = await Order.aggregate([
      { $match: orderMatch },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // 2. Total Orders (filtered)
    const totalOrders = await Order.countDocuments(orderMatch);

    // 3. Total Products (agar filtered hai to sirf woh products jo us range mein bike)
    let totalProducts;
    if (range === 'all') {
      totalProducts = await Product.countDocuments();
    } else {
      const productResult = await Order.aggregate([
        { $match: orderMatch },
        { $unwind: '$items' },
        { $group: { _id: '$items.id' } },
        { $count: 'count' },
      ]);
      totalProducts = productResult[0]?.count || 0;
    }

    // 4. Total Customers (agar filtered hai to sirf woh customers jinhone us range mein order kiya)
    let totalCustomers;
    if (range === 'all') {
      totalCustomers = await User.countDocuments();
    } else {
      const customerResult = await Order.aggregate([
        { $match: orderMatch },
        {
          $group: {
            _id: { $ifNull: ['$userId', '$email'] },
          },
        },
        { $count: 'count' },
      ]);
      totalCustomers = customerResult[0]?.count || 0;
    }

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
    });
  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.json({
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
    });
  }
});

// ==================== GET /api/dashboard/sales ====================
router.get('/sales', async (req, res) => {
  try {
    const { range = 'weekly', startDate, endDate, specificDate } = req.query;

    const now = new Date();
    let start = new Date();
    let end = new Date();
    let groupBy = 'day';

    if (range === 'daily') {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      groupBy = 'hour';
    } else if (range === 'weekly') {
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      groupBy = 'day';
    } else if (range === 'monthly') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      groupBy = 'week';
    } else if (range === 'yearly') {
      start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      groupBy = 'month';
    } else if (range === 'custom' && startDate && endDate) {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      groupBy = days > 30 ? 'month' : 'day';
    } else if (range === 'specific' && specificDate) {
      start = new Date(specificDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(specificDate);
      end.setHours(23, 59, 59, 999);
      groupBy = 'hour';
    }

    const matchStage = {
      createdAt: { $gte: start, $lte: end },
      status: { $nin: ['cancelled'] },
    };

    let groupId;
    if (groupBy === 'hour') {
      groupId = { $hour: '$createdAt' };
    } else if (groupBy === 'day') {
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
      };
    } else if (groupBy === 'week') {
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        week: { $ceil: { $divide: [{ $dayOfMonth: '$createdAt' }, 7] } },
      };
    } else {
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
      };
    }

    const salesData = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupId,
          total: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.week': 1,
          '_id.day': 1,
          _id: 1,
        },
      },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (groupBy === 'hour') {
      const hourMap = {};
      salesData.forEach((item) => {
        hourMap[item._id] = item;
      });

      const filledData = [];
      for (let h = 0; h < 24; h++) {
        filledData.push(hourMap[h] || { _id: h, total: 0, count: 0 });
      }

      const formatted = filledData.map((item) => ({
        day: `${String(item._id).padStart(2, '0')}:00`,
        value: item.total,
        orders: item.count,
      }));

      return res.json(formatted);
    }

    const formatted = salesData.map((item) => {
      let label = '';
      if (groupBy === 'day') {
        label = `${monthNames[item._id.month - 1]} ${item._id.day}`;
      } else if (groupBy === 'week') {
        label = `Week ${item._id.week}`;
      } else {
        label = `${monthNames[item._id.month - 1]} ${item._id.year}`;
      }
      return { day: label, value: item.total, orders: item.count };
    });

    res.json(formatted);
  } catch (error) {
    console.error('❌ Dashboard sales error:', error);
    res.json([]);
  }
});

// ==================== GET /api/dashboard/recent-orders ====================
router.get('/recent-orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    const formatted = orders.map((o) => ({
      _id: o._id,
      orderId: o.orderId,
      name: o.fullName,
      amount: o.total,
      status: o.status || 'pending',
      date: o.createdAt,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('❌ Dashboard recent-orders error:', error);
    res.json([]);
  }
});

// ==================== GET /api/dashboard/top-products ====================
router.get('/top-products', async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.id',
          name: { $first: '$items.name' },
          image: { $first: '$items.image' },
          sold: { $sum: '$items.qty' },
          revenue: {
            $sum: { $multiply: ['$items.price', '$items.qty'] },
          },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
    ]);

    const formatted = topProducts.map((p) => ({
      _id: p._id,
      name: p.name || 'Unknown Product',
      image: p.image || '',
      sold: p.sold || 0,
      revenue: p.revenue || 0,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('❌ Dashboard top-products error:', error);
    res.json([]);
  }
});

// ==================== GET /api/dashboard/recent-subscribers ====================
router.get('/recent-subscribers', async (req, res) => {
  try {
    const subscribers = await Newsletter.find()
      .sort({ subscribedAt: -1 })
      .limit(5)
      .lean();

    res.json(subscribers || []);
  } catch (error) {
    console.error('❌ Dashboard recent-subscribers error:', error);
    res.json([]);
  }
});

module.exports = router;