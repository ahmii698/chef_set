// src/component/recent.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL, STORAGE_URL } from '../../config';
import './recent.css';

const Recent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/home-product`);
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="recent-section">
        <div className="recent-header">
          <div className="recent-header-text">
            <span className="recent-label">OUR PREMIUM COLLECTION</span>
            <h2>EQUIPMENT FOR EVERY <span>KITCHEN.</span></h2>
          </div>
          <Link to="/products" className="btn-view-all">VIEW ALL PRODUCTS</Link>
        </div>
        <div className="recent-grid">
          {[1, 2, 3, 4].map((i) => (
            <div className="recent-card" key={i}>
              <div className="recent-image-wrap">
                <div className="recent-skeleton"></div>
              </div>
              <div className="recent-info">
                <div className="recent-skeleton-text"></div>
                <div className="recent-skeleton-price"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!data) return null;

  const products = [...data.products].sort((a, b) => a.order - b.order);

  return (
    <section className="recent-section">
      <div className="recent-header">
        <div className="recent-header-text">
          <span className="recent-label">{data.title}</span>
          <h2>{data.subtitle}</h2>
        </div>
        <Link to="/products" className="btn-view-all">VIEW ALL PRODUCTS</Link>
      </div>

      <div className="recent-grid">
        {products.map((product) => (
          <div className="recent-card" key={product._id || product.order}>
            <div className="recent-image-wrap">
              <img 
                src={`${STORAGE_URL}/${product.image}`} 
                alt={product.name} 
              />
            </div>
            <div className="recent-info">
              <h3>{product.name}</h3>
              <p className="recent-price">PKR {product.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Recent;