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
import Testimonials from './components/testimonials';
import Billing from './components/billing';

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
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/billing" element={<Billing />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;