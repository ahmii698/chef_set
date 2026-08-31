// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Common Components
import Header from './common/header';
import Footer from './common/footer';

// Page Components
import Home from './components/home';
import Products from './components/products';
import ProductDetail from './components/productDetail';
import About from './components/about';
import Contact from './components/contact';
import FAQ from './components/faq/faq';
import Cart from './components/cart/cart';
import Wishlist from './components/wishlist/wishlist';
import Profile from './components/profile/profile';
import CheckoutPage from './components/checkout/CheckoutPage';
import TrackOrder from './components/checkout/trackorder';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />        {/* ← CONTACT PEHLE */}
            <Route path="/trackorder" element={<TrackOrder />} />  {/* ← TRACK ORDER BAAD MEIN */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;