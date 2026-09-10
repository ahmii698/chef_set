// backend/routes/adminProducts.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const User = require('../models/User');

// ============================================================
// ===== MULTER CONFIG =====
// ============================================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `product-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

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
// ===== GET ALL PRODUCTS (Admin) =====
// ============================================================
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== GET SINGLE PRODUCT =====
// ============================================================
router.get('/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== CREATE PRODUCT =====
// ============================================================
router.post('/', verifyAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const {
      name, price, salePrice, category, stock, status,
      shortDesc, description, featured, mainImageIndex
    } = req.body;

    if (!name || !price || !category || !stock) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Get uploaded image paths
    const imagePaths = req.files?.map(file => file.filename) || [];
    const mainIdx = parseInt(mainImageIndex) || 0;
    const mainImage = imagePaths[mainIdx] || imagePaths[0] || '';

    const product = new Product({
      name,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      category,
      stock: Number(stock),
      status: status || 'Active',
      shortDesc: shortDesc || '',
      description: description || '',
      featured: featured === 'true',
      image: mainImage,
      images: imagePaths,
      features: req.body.features ? JSON.parse(req.body.features) : []
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== UPDATE PRODUCT =====
// ============================================================
router.put('/:id', verifyAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name, price, salePrice, category, stock, status,
      shortDesc, description, featured, mainImageIndex,
      existingImages
    } = req.body;

    // Update fields
    if (name) product.name = name;
    if (price) product.price = Number(price);
    if (salePrice !== undefined) product.salePrice = salePrice ? Number(salePrice) : null;
    if (category) product.category = category;
    if (stock) product.stock = Number(stock);
    if (status) product.status = status;
    if (shortDesc !== undefined) product.shortDesc = shortDesc;
    if (description !== undefined) product.description = description;
    if (featured !== undefined) product.featured = featured === 'true';

    // Handle images
    let allImages = existingImages ? JSON.parse(existingImages) : [];
    if (req.files && req.files.length > 0) {
      const newPaths = req.files.map(file => file.filename);
      allImages = [...allImages, ...newPaths];
    }
    
    if (allImages.length > 0) {
      const mainIdx = parseInt(mainImageIndex) || 0;
      product.images = allImages;
      product.image = allImages[mainIdx] || allImages[0];
    }

    if (req.body.features) {
      product.features = JSON.parse(req.body.features);
    }

    await product.save();
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== DELETE PRODUCT =====
// ============================================================
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;