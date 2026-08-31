// src/components/wishlist/wishlist.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiShoppingCart,
  FiHeart,
  FiShield,
  FiTruck,
  FiLock,
  FiHeadphones,
  FiArrowRight,
} from "react-icons/fi";
import { getWishlist, saveWishlist, removeFromWishlist } from "../../utils/wishlist";
import "./wishlist.css";

const features = [
  {
    icon: FiShield,
    title: "Premium Quality",
    desc: "Top quality products for professional chefs",
  },
  {
    icon: FiTruck,
    title: "Fast Shipping",
    desc: "Quick and reliable delivery worldwide",
  },
  {
    icon: FiLock,
    title: "Secure Payment",
    desc: "100% secure and encrypted payment",
  },
  {
    icon: FiHeadphones,
    title: "24/7 Support",
    desc: "We're here to help you anytime",
  },
];

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addItemsToCart(items) {
  const cart = getCart();
  items.forEach((item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...item, qty: 1 });
    }
  });
  saveCart(cart);
}

function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => getWishlist());
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const handleRemove = (id) => {
    const updated = removeFromWishlist(id);
    setItems(updated);
  };

  const handleAddToCart = (item) => {
    addItemsToCart([item]);
    const updated = removeFromWishlist(item.id);
    setItems(updated);
    showToast(`${item.name} added to cart`);
  };

  const handleMoveAllToCart = () => {
    if (items.length === 0) return;
    addItemsToCart(items);
    saveWishlist([]);
    setItems([]);
    showToast("All items moved to cart");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  return (
    <div className="wl-page">
      {toast && <div className="wl-toast">{toast}</div>}

      <div className="wl-header">
        <div>
          <h1 className="wl-title">My Wishlist</h1>
          <div className="wl-breadcrumb">
            <span>Home</span>
            <span className="wl-breadcrumb-sep">›</span>
            <span className="wl-breadcrumb-active">Wishlist</span>
          </div>
        </div>
        <div className="wl-header-actions">
          <button
            className="wl-btn wl-btn-primary"
            onClick={handleMoveAllToCart}
            disabled={items.length === 0}
          >
            <FiShoppingCart size={16} />
            Move All to Cart
          </button>
        </div>
      </div>

      <div className="wl-card">
        {items.length === 0 ? (
          <div className="wl-empty">
            <FiHeart size={28} />
            <p>Your wishlist is empty.</p>
            <button className="wl-btn wl-btn-primary" onClick={handleContinueShopping}>
              Browse Products
            </button>
          </div>
        ) : (
          <table className="wl-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="wl-product-cell">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="wl-product-thumb"
                      />
                      <div>
                        <div className="wl-product-name">{item.name}</div>
                        <div className="wl-product-desc">{item.desc}</div>
                        <div className="wl-stock-tag">
                          <span className="wl-stock-dot" />
                          In Stock
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="wl-price">${item.price.toFixed(2)}</span>
                  </td>
                  <td>
                    <div className="wl-availability">
                      <span className="wl-availability-status">In Stock</span>
                      <span className="wl-availability-shipping">
                        {item.shipping}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="wl-actions-cell">
                      <button
                        className="wl-icon-btn"
                        onClick={() => handleRemove(item.id)}
                        aria-label="Remove from wishlist"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      <button
                        className="wl-btn wl-btn-primary wl-btn-sm"
                        onClick={() => handleAddToCart(item)}
                      >
                        <FiShoppingCart size={14} />
                        Add to Cart
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="wl-features-row">
          {features.map((f) => (
            <div className="wl-feature-item" key={f.title}>
              <div className="wl-feature-icon">
                <f.icon size={20} />
              </div>
              <div>
                <div className="wl-feature-title">{f.title}</div>
                <div className="wl-feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="wl-footer">
        <div className="wl-footer-left">
          <FiHeart size={18} />
          <div>
            <div className="wl-footer-title">Don't see what you're looking for?</div>
            <div className="wl-footer-desc">
              Explore our full collection and find the perfect kitchen
              equipment for your needs.
            </div>
          </div>
        </div>
        <button className="wl-btn wl-btn-primary" onClick={handleContinueShopping}>
          Continue Shopping
          <FiArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default Wishlist;