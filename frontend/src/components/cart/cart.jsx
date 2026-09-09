// src/components/cart/cart.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaLock,
  FaShieldAlt,
  FaTruck,
  FaSyncAlt,
  FaHeadset,
  FaAward,
  FaArrowLeft,
  FaInfoCircle,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
  FaCcDiscover,
  FaShoppingCart,
} from 'react-icons/fa';
import { getCart, updateCartQty, removeFromCart } from '../../utils/cart';
import { STORAGE_URL } from '../../../config';
import './cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const refreshItems = () => {
    setItems(getCart());
  };

  useEffect(() => {
    refreshItems();

    window.addEventListener('cart-updated', refreshItems);
    window.addEventListener('storage', refreshItems);

    return () => {
      window.removeEventListener('cart-updated', refreshItems);
      window.removeEventListener('storage', refreshItems);
    };
  }, []);

  const updateQty = (id, delta) => {
    const current = items.find((item) => item.id === id);
    if (!current) return;
    updateCartQty(id, current.qty + delta);
    refreshItems();
  };

  const removeItem = (id) => {
    removeFromCart(id);
    refreshItems();
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout', { state: { cartItems: items } });
  };

  // ✅ EMPTY CART HANDLER
  const renderEmptyCart = () => {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty-icon">
          <FaShoppingCart size={48} />
        </div>
        <h2 className="cart-empty-title">Your cart is empty</h2>
        <p className="cart-empty-desc">
          Looks like you haven't added any items to your cart yet.
          Explore our premium collection and find the perfect tools for your kitchen.
        </p>
        <button className="cart-empty-btn" onClick={handleContinueShopping}>
          Start Shopping
          <FaArrowLeft className="cart-empty-btn-icon" />
        </button>
      </div>
    );
  };

  // ✅ CART WITH ITEMS
  const renderCartItems = () => {
    return (
      <>
        <div className="cart-items-panel">
          <div className="cart-table-head">
            <span className="col-product">PRODUCT</span>
            <span className="col-price">PRICE</span>
            <span className="col-qty">QUANTITY</span>
            <span className="col-total">TOTAL</span>
          </div>

          <div className="cart-table-body">
            {items.map((item) => {
              const imageSrc = item.image?.startsWith('http') 
                ? item.image 
                : `${STORAGE_URL}/${item.image}`;

              return (
                <div className="cart-row" key={item.id}>
                  <div className="col-product cart-product-info">
                    <div className="cart-product-img">
                      <img 
                        src={imageSrc} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.png';
                        }}
                      />
                    </div>
                    <div>
                      <p className="cart-product-name">{item.name}</p>
                      {item.desc && <p className="cart-product-desc">{item.desc}</p>}
                      {item.inStock && (
                        <span className="cart-stock-badge">
                          <span className="stock-dot" />
                          In Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-price">PKR {item.price.toLocaleString()}</div>

                  <div className="col-qty">
                    <div className="qty-stepper">
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <FaMinus />
                      </button>
                      <span className="qty-value">{item.qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div className="col-total cart-row-total">
                    PKR {(item.price * item.qty).toLocaleString()}
                  </div>

                  <button
                    className="cart-remove-btn"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cart-summary-panel">
          <h3 className="cart-summary-title">ORDER SUMMARY</h3>

          <div className="summary-line">
            <span>Subtotal ({items.length} items)</span>
            <span>PKR {subtotal.toLocaleString()}</span>
          </div>
          <div className="summary-line">
            <span>
              Shipping <FaInfoCircle className="info-icon" />
            </span>
            <span>PKR {shipping.toLocaleString()}</span>
          </div>
          <div className="summary-line">
            <span>Tax</span>
            <span>PKR {tax.toLocaleString()}</span>
          </div>

          <div className="summary-total-line">
            <span>TOTAL</span>
            <span className="summary-total-value">PKR {total.toLocaleString()}</span>
          </div>

          <button
            className="btn-checkout"
            onClick={handleProceedToCheckout}
            disabled={items.length === 0}
          >
            <FaLock />
            PROCEED TO CHECKOUT
          </button>

          <p className="cart-accept-label">WE ACCEPT</p>
          <div className="cart-payment-icons">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcAmex />
            <FaCcPaypal />
            <FaCcDiscover />
          </div>

          <div className="cart-trust-list">
            <div className="trust-item">
              <FaShieldAlt />
              <span>Secure &amp; Safe Payments</span>
            </div>
            <div className="trust-item">
              <FaTruck />
              <span>Fast &amp; Reliable Shipping</span>
            </div>
            <div className="trust-item">
              <FaSyncAlt />
              <span>Easy Returns Within 30 Days</span>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <section className="cart-section">
      {/* Header */}
      <div className="cart-header">
        <div>
          <h1>YOUR CART</h1>
          <div className="cart-breadcrumb">
            <span>Home</span>
            <span className="crumb-sep">›</span>
            <span className="crumb-active">Cart</span>
          </div>
        </div>
        {items.length > 0 && (
          <button className="btn-continue-shopping" onClick={handleContinueShopping}>
            <FaArrowLeft />
            CONTINUE SHOPPING
          </button>
        )}
      </div>

      <div className="cart-container">
        {/* ✅ IF CART EMPTY - Show Empty Cart Message */}
        {items.length === 0 ? renderEmptyCart() : renderCartItems()}
      </div>

      {/* Bottom Features Strip */}
      <div className="cart-features">
        <div className="cart-feature-item">
          <span className="cart-feature-icon">
            <FaAward />
          </span>
          <div>
            <h4>PREMIUM QUALITY</h4>
            <p>Top quality products for professional chefs</p>
          </div>
        </div>

        <div className="cart-feature-item">
          <span className="cart-feature-icon">
            <FaTruck />
          </span>
          <div>
            <h4>FAST SHIPPING</h4>
            <p>Quick and reliable delivery worldwide</p>
          </div>
        </div>

        <div className="cart-feature-item">
          <span className="cart-feature-icon">
            <FaShieldAlt />
          </span>
          <div>
            <h4>SECURE PAYMENT</h4>
            <p>100% secure and encrypted payment</p>
          </div>
        </div>

        <div className="cart-feature-item">
          <span className="cart-feature-icon">
            <FaHeadset />
          </span>
          <div>
            <h4>24/7 SUPPORT</h4>
            <p>We're here to help you anytime</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;