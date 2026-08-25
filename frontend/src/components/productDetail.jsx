// src/components/productDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './productDetail.css';

const productData = {
  1: {
    name: 'Professional Chef Knife',
    price: 'PHR 8,500',
    description: 'High carbon stainless steel blade for exceptional sharpness and edge retention. Ergonomic handle fits comfortably over the hand.',
    image: '🔪',
    features: [
      'High-carbon stainless steel blade',
      'Ergonomic ergonomic handle',
      'Flat top for perfect balance',
      'Premium grip for durability'
    ]
  },
  2: {
    name: 'Tongs & Spatulas Set',
    price: 'PHR 8,500',
    description: 'Professional grade utensils designed for precision cooking. Heat resistant and durable.',
    image: '🥄',
    features: [
      'Heat resistant up to 400°F',
      'Non-slip grip handles',
      'Stainless steel construction',
      'Dishwasher safe'
    ]
  },
  3: {
    name: 'Stainless Steel Containers',
    price: 'PHR 8,500',
    description: 'Premium stainless steel containers for professional storage. Airtight and durable.',
    image: '📦',
    features: [
      '18/8 stainless steel',
      'Airtight lids',
      'Stackable design',
      'BPA-free'
    ]
  },
  4: {
    name: 'Premium Cutlery Set',
    price: 'PHR 8,500',
    description: 'Complete cutlery set for professional and home use. Precision forged for durability.',
    image: '🍴',
    features: [
      'Precision forged blades',
      'Ergonomic handles',
      'Mirror finish',
      'Lifetime warranty'
    ]
  },
  5: {
    name: 'Non-Stick Frying Pan',
    price: 'PHR 8,500',
    description: 'Professional non-stick frying pan for perfect cooking results every time.',
    image: '🍳',
    features: [
      'Premium non-stick coating',
      'Even heat distribution',
      'Comfortable handle',
      'Oven safe up to 400°F'
    ]
  },
  6: {
    name: 'Professional Mixing Bowl',
    price: 'PHR 8,500',
    description: 'Heavy-duty mixing bowl for professional kitchens. Perfect for all mixing tasks.',
    image: '🥣',
    features: [
      'Stainless steel construction',
      'Non-slip base',
      'Easy pour spout',
      'Dishwasher safe'
    ]
  },
  7: {
    name: 'Modern Cutting Board',
    price: 'PHR 8,500',
    description: 'Professional grade cutting board with modern design. Durable and easy to clean.',
    image: '🪵',
    features: [
      'Premium bamboo construction',
      'Non-slip edges',
      'Juice groove',
      'Easy to clean'
    ]
  },
  8: {
    name: 'Kids Mixer Set',
    price: 'PHR 8,500',
    description: 'Safe and fun mixer set for young chefs. Educational and entertaining.',
    image: '🎛️',
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
      <div className="product-detail-container">
        <div className="product-detail-image">
          <div className="product-emoji">{product.image}</div>
        </div>
        
        <div className="product-detail-info">
          <h1>{product.name}</h1>
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

          <div className="product-actions">
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
            
            <button className="btn-add-to-cart">ADD TO CART</button>
            <button className="btn-learn-more">LEARN MORE</button>
          </div>

          <div className="product-benefits">
            <div className="benefit-item">
              <span>🚚</span>
              <div>
                <h4>FREE SHIPPING</h4>
                <p>On all orders above PHR 8,000</p>
              </div>
            </div>
            <div className="benefit-item">
              <span>⭐</span>
              <div>
                <h4>QUALITY GUARANTEE</h4>
                <p>100% satisfaction guarantee</p>
              </div>
            </div>
            <div className="benefit-item">
              <span>🔄</span>
              <div>
                <h4>SAVE KITCHEN</h4>
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