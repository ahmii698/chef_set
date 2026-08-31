// src/components/home/hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>BUILT FOR THE <span>SERIOUS CHEF.</span></h1>
        <p className="hero-description">
          Premium kitchen equipment designed for precision, performance,
          and everyday professional cooking.
        </p>
        <div className="hero-buttons">
          <Link to="/products" className="hero-btn-primary">EXPLORE PRODUCTS</Link>
          <Link to="/about" className="hero-btn-secondary">DISCOVER CRAFT</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;