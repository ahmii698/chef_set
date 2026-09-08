// src/components/productDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaTruck, FaStar, FaUndo, FaShoppingCart, FaChevronRight, FaHeart } from 'react-icons/fa';
import { addToCart } from '../utils/cart';
import { isInWishlist, addToWishlist } from '../utils/wishlist';
import { API_URL, STORAGE_URL } from '../../config';
import './productDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [toast, setToast] = useState('');

  // Fetch single product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2000);
  };

  if (loading) {
    return (
      <div className="product-detail">
        <div className="product-detail-container">
          <h2>Loading product details...</h2>
        </div>
      </div>
    );
  }

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

  const handleAddToCart = () => {
    addToCart(
      {
        id: product._id,
        name: product.name,
        desc: product.description,
        price: product.price,
        image: product.image,
      },
      quantity
    );
    showToast('Added to cart');
  };

  const handleWishlistClick = () => {
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

  // ✅ YAHAN CHANGE HUA HAI - Database se images array use karo
  const getProductImages = () => {
    if (product.images && product.images.length > 0) {
      return product.images.map(img => `${STORAGE_URL}/${img}`);
    } else {
      return [
        `${STORAGE_URL}/${product.image}`,
        `${STORAGE_URL}/${product.image}`,
        `${STORAGE_URL}/${product.image}`,
        `${STORAGE_URL}/${product.image}`
      ];
    }
  };

  const images = getProductImages();

  // Features from database ya fallback
  const features = product.features || [
    'Premium quality material',
    'Professional grade design',
    'Durable and long lasting',
    'Easy to clean and maintain'
  ];

  return (
    <div className="product-detail">
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

      {/* Breadcrumb */}
      <div className="product-breadcrumb">
        <Link to="/">Home</Link>
        <FaChevronRight className="breadcrumb-arrow" />
        <Link to="/products">Shop</Link>
        <FaChevronRight className="breadcrumb-arrow" />
        <span>{product.name}</span>
      </div>

      <div className="product-detail-container">
        {/* Left Side - Vertical Thumbnails */}
        <div className="product-thumbnails-col">
          {images.map((img, index) => (
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
          <img src={images[mainImage]} alt={product.name} />
        </div>

        {/* Right Side - Info */}
        <div className="product-detail-info">
          <h1>{product.name}</h1>

          <div className="product-rating">
            {[...Array(product.rating || 5)].map((_, i) => (
              <FaStar key={i} className="rating-star" />
            ))}
          </div>

          <p className="product-detail-price">PKR {product.price.toLocaleString()}</p>
          <p className="product-detail-description">{product.description}</p>

          <div className="product-features">
            <h3>FEATURES:</h3>
            <ul>
              {features.map((feature, index) => (
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
            <button className="btn-add-to-cart" onClick={handleAddToCart}>
              <FaShoppingCart className="btn-icon" /> ADD TO CART
            </button>
            <button className="btn-wishlist" onClick={handleWishlistClick}>
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