// src/components/products.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './products.css';

const products = [
  {
    id: 1,
    name: 'Professional Chef Knife',
    price: '£1,500',
    image: '🔪',
    category: 'Knives'
  },
  {
    id: 2,
    name: 'Tongs & Spatulas Set',
    price: '£1,500',
    image: '🥄',
    category: 'Utensils'
  },
  {
    id: 3,
    name: 'Stainless Steel Containers',
    price: '£1,500',
    image: '📦',
    category: 'Storage'
  },
  {
    id: 4,
    name: 'Premium Cutlery Set',
    price: '£1,500',
    image: '🍴',
    category: 'Cutlery'
  },
  {
    id: 5,
    name: 'Non-Stick Frying Pan',
    price: '£1,500',
    image: '🍳',
    category: 'Cookware'
  },
  {
    id: 6,
    name: 'Professional Mixing Bowl',
    price: '£1,500',
    image: '🥣',
    category: 'Bowls'
  },
  {
    id: 7,
    name: 'Modern Cutting Board',
    price: '£1,500',
    image: '🪵',
    category: 'Boards'
  },
  {
    id: 8,
    name: 'Kids Mixer Set',
    price: '£1,500',
    image: '🎛️',
    category: 'Mixers'
  }
];

const Products = () => {
  return (
    <div className="products">
      <div className="products-header">
        <h1>PREMIUM QUALITY <span>KITCHEN EQUIPMENT.</span></h1>
        <p>
          Explore our wide range of professional kitchen equipment designed 
          for chefs and home cooks.
        </p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className="product-card">
            <div className="product-image">{product.image}</div>
            <h3>{product.name}</h3>
            <p className="product-category">{product.category}</p>
            <p className="product-price">{product.price}</p>
            <button className="btn-view">View Details</button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Products;