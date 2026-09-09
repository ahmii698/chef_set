// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const User = require('../models/User');

// ============================================================
// ===== MULTER CONFIGURATION (File Upload) =====
// ============================================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads/proofs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG and JPG files are allowed'));
    }
  }
});

// ============================================================
// ===== GENERATE ORDER ID =====
// ============================================================
const generateOrderId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'LXE';
  for (let i = 0; i < 11; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// ============================================================
// ===== GET USER FROM TOKEN =====
// ============================================================
const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded;
  } catch (e) {
    return null;
  }
};

// ============================================================
// ===== CREATE ORDER =====
// ============================================================
router.post('/', async (req, res) => {
  try {
    const {
      fullName, email, phone, address, city, zipcode,
      paymentMethod, notes, items, subtotal, shipping, total,
      orderId // Frontend se aayega
    } = req.body;

    if (!fullName || !email || !phone || !address || !city) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // ✅ Get user ID from token
    let userId = null;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        userId = decoded.userId;
      } catch (e) {
        // Token invalid, continue without userId
      }
    }

    // Use frontend orderId or generate one
    const finalOrderId = orderId || generateOrderId();

    const order = new Order({
      orderId: finalOrderId,
      fullName,
      email: email.toLowerCase(),
      phone,
      address,
      city,
      zipcode: zipcode || '',
      paymentMethod: paymentMethod || 'Bank Transfer',
      notes: notes || '',
      items,
      subtotal,
      shipping: shipping || 0,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      paymentProof: null,
      userId // ✅ Save user ID
    });

    await order.save();

    res.status(201).json({
      message: 'Order placed successfully!',
      orderId: finalOrderId,
      order: order
    });
  } catch (error) {
    console.error('❌ Order error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== UPLOAD PAYMENT PROOF =====
// ============================================================
router.post('/upload-proof/:orderId', upload.single('proof'), async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ✅ Check if user owns this order
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId);
        if (user && user.role !== 'admin' && order.userId?.toString() !== decoded.userId) {
          return res.status(403).json({ message: 'Unauthorized' });
        }
      } catch (e) {
        // Token invalid
      }
    }

    order.paymentProof = `/uploads/proofs/${req.file.filename}`;
    await order.save();

    res.json({ 
      message: 'Proof uploaded successfully!',
      proofPath: order.paymentProof
    });
  } catch (error) {
    console.error('❌ Upload proof error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== GET ORDER BY ID =====
// ============================================================
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('❌ Get order error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== GET ALL ORDERS (with user filtering) =====
// ============================================================
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    let filter = {};
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId);
        
        if (user) {
          if (user.role === 'admin') {
            // Admin: saare orders dikhao
            filter = {};
          } else {
            // Normal user: sirf uske orders dikhao
            filter = { 
              $or: [
                { email: user.email },
                { userId: user._id }
              ]
            };
          }
        }
      } catch (e) {
        // Invalid token
        return res.json([]);
      }
    }
    
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('❌ Get orders error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== UPDATE ORDER STATUS (Admin) =====
// ============================================================
router.put('/:orderId', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    // ✅ Check if admin
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId);
        if (!user || user.role !== 'admin') {
          return res.status(403).json({ message: 'Admin access required' });
        }
      } catch (e) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();

    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('❌ Update order error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;