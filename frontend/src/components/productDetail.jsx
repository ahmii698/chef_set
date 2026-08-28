// src/components/productDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaTruck, FaStar, FaUndo, FaShoppingCart, FaChevronRight, FaHeart } from 'react-icons/fa';
import './productDetail.css';

// Import product images
import p1 from '/images/p1.png';
import p2 from '/images/p2.png';
import p3 from '/images/p3.png';
import p4 from '/images/p4.png';
import p5 from '/images/p5.png';
import p6 from '/images/p6.png';
import p7 from '/images/p7.png';
import p8 from '/images/p8.png';

const productData = {
  1: {
    name: 'Professional Chef Knife',
    price: 'PKR 8,500',
    rating: 5,
    description: 'High-carbon premium steel blade for exceptional sharpness and edge retention. Ergonomic handle for comfortable grip.',
    images: [p1, p1, p1, p1],
    features: [
      'High-carbon stainless steel blade',
      'Ergonomic ergonomic handle',
      'Full tang for perfect balance',
      'Precision ground to durability'
    ]
  },
  2: {
    name: 'Tongs & Spatulas Set',
    price: 'PKR 8,500',
    rating: 5,
    description: 'Professional grade utensils designed for precision cooking. Heat resistant and durable.',
    images: [p2, p2, p2, p2],
    features: [
      'Heat resistant up to 400°F',
      'Non-slip grip handles',
      'Stainless steel construction',
      'Dishwasher safe'
    ]
  },
  3: {
    name: 'Stainless Steel Containers',
    price: 'PKR 8,500',
    rating: 5,
    description: 'Premium stainless steel containers for professional storage. Airtight and durable.',
    images: [p3, p3, p3, p3],
    features: [
      '18/8 stainless steel',
      'Airtight lids',
      'Stackable design',
      'BPA-free'
    ]
  },
  4: {
    name: 'Premium Cutlery Set',
    price: 'PKR 8,500',
    rating: 5,
    description: 'Complete cutlery set for professional and home use. Precision forged for durability.',
    images: [p4, p4, p4, p4],
    features: [
      'Precision forged blades',
      'Ergonomic handles',
      'Mirror finish',
      'Lifetime warranty'
    ]
  },
  5: {
    name: 'Non-Stick Frying Pan',
    price: 'PKR 8,500',
    rating: 5,
    description: 'Professional non-stick frying pan for perfect cooking results every time.',
    images: [p5, p5, p5, p5],
    features: [
      'Premium non-stick coating',
      'Even heat distribution',
      'Comfortable handle',
      'Oven safe up to 400°F'
    ]
  },
  6: {
    name: 'Professional Mixing Bowl',
    price: 'PKR 8,500',
    rating: 5,
    description: 'Heavy-duty mixing bowl for professional kitchens. Perfect for all mixing tasks.',
    images: [p6, p6, p6, p6],
    features: [
      'Stainless steel construction',
      'Non-slip base',
      'Easy pour spout',
      'Dishwasher safe'
    ]
  },
  7: {
    name: 'Modern Cutting Board',
    price: 'PKR 8,500',
    rating: 5,
    description: 'Professional grade cutting board with modern design. Durable and easy to clean.',
    images: [p7, p7, p7, p7],
    features: [
      'Premium bamboo construction',
      'Non-slip edges',
      'Juice groove',
      'Easy to clean'
    ]
  },
  8: {
    name: 'Kids Mixer Set',
    price: 'PKR 8,500',
    rating: 5,
    description: 'Safe and fun mixer set for young chefs. Educational and entertaining.',
    images: [p8, p8, p8, p8],
    features: [
      'Safe plastic construction',
      'BPA-free materials',
      'Interactive design',
      'Easy to use'
    ]
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const product = productData[id];

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <Link to="/products" className="btn-primary">Back to Products</Link>
      </div>
    );
  }

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value) || 1);
  };

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <div className="product-breadcrumb">
        <Link to="/">Home</Link>
        <FaChevronRight className="breadcrumb-arrow" />
        <Link to="/products">Products</Link>
        <FaChevronRight className="breadcrumb-arrow" />
        <span>{product.name}</span>
      </div>

      <div className="product-detail-container">
        {/* Left Side - Vertical Thumbnails */}
        <div className="product-thumbnails-col">
          {product.images.map((img, index) => (
            <div
              key={index}
              className={`thumbnail ${mainImage === index ? 'active' : ''}`}
              onClick={() => setMainImage(index)}
            >
              <img src={img} alt={`${product.name} ${index + 1}`} />
            </div>
          ))}
        </div>

        {/* Center - Main Image */}
        <div className="product-main-image">
          <img src={product.images[mainImage]} alt={product.name} />
        </div>

        {/* Right Side - Info */}
        <div className="product-detail-info">
          <h1>{product.name}</h1>

          <div className="product-rating">
            {[...Array(product.rating)].map((_, i) => (
              <FaStar key={i} className="rating-star" />
            ))}
          </div>

          <p className="product-detail-price">{product.price}</p>
          <p className="product-detail-description">{product.description}</p>

          <div className="product-features">
            <h3>FEATURES:</h3>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="quantity-selector">
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>

          <div className="product-actions">
            <button className="btn-add-to-cart">
              <FaShoppingCart className="btn-icon" /> ADD TO CART
            </button>
            <button className="btn-wishlist">
              <FaHeart className="btn-icon" /> WISHLIST
            </button>
          </div>

          <div className="product-benefits">
            <div className="benefit-item">
              <FaTruck className="benefit-icon" />
              <div>
                <h4>FREE SHIPPING</h4>
                <p>On all orders above PKR 8,000</p>
              </div>
            </div>
            <div className="benefit-item">
              <FaStar className="benefit-icon" />
              <div>
                <h4>QUALITY GUARANTEE</h4>
                <p>100% satisfaction guarantee</p>
              </div>
            </div>
            <div className="benefit-item">
              <FaUndo className="benefit-icon" />
              <div>
                <h4>EASY RETURNS</h4>
                <p>30-day returns policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;