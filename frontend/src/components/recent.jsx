// src/component/recent.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './recent.css';

const recentProducts = [
  {
    id: 1,
    name: 'Professional Chef Knife',
    price: 'PKR 8,500',
    image: '/images/product-1.jpg',
  },
  {
    id: 2,
    name: 'Stainless Steel Cookware',
    price: 'PKR 24,000',
    image: '/images/product-2.jpg',
  },
  {
    id: 3,
    name: 'Cast Iron Grill Pan',
    price: 'PKR 6,900',
    image: '/images/product-3.jpg',
  },
  {
    id: 4,
    name: 'Professional Mixing Bowl',
    price: 'PKR 3,200',
    image: '/images/product-4.jpg',
  },
];

const Recent = () => {
  return (
    <section className="recent-section">
      <div className="recent-header">
        <span className="recent-label">OUR PREMIUM COLLECTION</span>
        <h2>EQUIPMENT FOR EVERY <span>KITCHEN.</span></h2>
      </div>

      <div className="recent-grid">
        {recentProducts.map((product) => (
          <div className="recent-card" key={product.id}>
            <div className="recent-image-wrap">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="recent-info">
              <h3>{product.name}</h3>
              <p className="recent-price">{product.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-cta">
        <Link to="/products" className="btn-view-all">VIEW ALL PRODUCTS</Link>
      </div>
    </section>
  );
};

export default Recent;