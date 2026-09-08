// src/components/products.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaArrowRight } from 'react-icons/fa';
import { isInWishlist, addToWishlist } from '../utils/wishlist';
import { API_URL, STORAGE_URL } from '../../config';
import './products.css';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2000);
  };

  const handleWishlistClick = (product) => {
    if (isInWishlist(product._id)) {
      showToast('Already in wishlist');
      return;
    }

    addToWishlist({
      id: product._id,
      name: product.name,
      desc: product.description,
      price: product.price,
      image: product.image,
      inStock: true,
      shipping: 'Ships in 1-2 days',
    });
    showToast('Added to wishlist');
  };

  if (loading) {
    return (
      <div className="products">
        <div className="products-header">
          <h1>PREMIUM <span>KITCHEN EQUIPMENT</span></h1>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products">
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '90px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1a1610',
            border: '1px solid #e8a33c',
            color: '#f0b95c',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            zIndex: 999,
          }}
        >
          {toast}
        </div>
      )}

      <div className="products-header">
        <h1>PREMIUM <span>KITCHEN EQUIPMENT</span></h1>
        <p>
          Explore high-quality tools crafted for professional chefs and cooking enthusiasts.
        </p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card-wrapper" key={product._id}>
            <div className="product-card">
              <div className="product-image">
                <img 
                  src={`${STORAGE_URL}/${product.image}`} 
                  alt={product.name} 
                />
                <span className="product-badge">{product.category}</span>

                <button
                  className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                  aria-label="Add to wishlist"
                  onClick={() => handleWishlistClick(product)}
                >
                  <FaHeart />
                </button>

                <div className="product-overlay"></div>
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-desc">{product.description}</p>

                <div className="product-bottom-row">
                  <p className="product-price">PKR {product.price.toLocaleString()}</p>
                  <Link to={`/product/${product._id}`} className="btn-view-link">
                    View Details <FaArrowRight className="btn-arrow" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;