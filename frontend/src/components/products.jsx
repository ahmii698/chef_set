// src/components/products.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaArrowRight } from 'react-icons/fa';
import './products.css';

const products = [
  {
    id: 1,
    name: 'Professional Chef Knife',
    price: '£1,500',
    image: '/images/p1.png',
    category: 'KNIVES',
    description: 'High-Quality Stainless Steel'
  },
  {
    id: 2,
    name: 'Tongs & Spatulas Set',
    price: '£1,500',
    image: '/images/p2.png',
    category: 'UTENSILS',
    description: 'Durable & Heat Resistant'
  },
  {
    id: 3,
    name: 'Stainless Steel Containers',
    price: '£1,500',
    image: '/images/p3.png',
    category: 'STORAGE',
    description: 'Leak Proof & Long Lasting'
  },
  {
    id: 4,
    name: 'Premium Cutlery Set',
    price: '£1,500',
    image: '/images/p4.png',
    category: 'CUTLERY',
    description: 'Elegant & Premium Finish'
  },
  {
    id: 5,
    name: 'Non-Stick Frying Pan',
    price: '£1,500',
    image: '/images/p5.png',
    category: 'COOKWARE',
    description: 'Even Heat Distribution'
  },
  {
    id: 6,
    name: 'Professional Mixing Bowl',
    price: '£1,500',
    image: '/images/p6.png',
    category: 'BOWLS',
    description: 'High-Grade Stainless Steel'
  },
  {
    id: 7,
    name: 'Modern Cutting Board',
    price: '£1,500',
    image: '/images/p7.png',
    category: 'BOARDS',
    description: 'Durable & Stylish Design'
  },
  {
    id: 8,
    name: 'Kids Mixer Set',
    price: '£1,500',
    image: '/images/p8.png',
    category: 'MIXERS',
    description: 'Powerful & Easy to Use'
  }
];

const Products = () => {
  return (
    <div className="products">
      <div className="products-header">
        <h1>PREMIUM <span>KITCHEN EQUIPMENT</span></h1>
        <p>
          Explore high-quality tools crafted for professional chefs and cooking enthusiasts.
        </p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card-wrapper" key={product.id}>
            <div className="product-card">
              {/* Product Image with overlay stuff */}
              <div className="product-image">
                <img src={product.image} alt={product.name} />

                {/* Category Badge - overlaid top-left */}
                <span className="product-badge">{product.category}</span>

                {/* Wishlist Heart - overlaid top-right */}
                <button className="wishlist-btn" aria-label="Add to wishlist">
                  <FaHeart />
                </button>

                {/* Hover Overlay - subtle darken only */}
                <div className="product-overlay"></div>
              </div>

              {/* Product Info */}
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-desc">{product.description}</p>

                <div className="product-bottom-row">
                  <p className="product-price">{product.price}</p>
                  <Link to={`/product/${product.id}`} className="btn-view-link">
                    View Details <FaArrowRight className="btn-arrow" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      
    </div>
  );
};

export default Products;