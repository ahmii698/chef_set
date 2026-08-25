// src/components/home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>BUILT FOR THE <span>SERIOUS CHEF.</span></h1>
          <p className="hero-description">
            Premium kitchen equipment designed for precision, performance, 
            and everyday professional cooking.
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn-primary">Explore Products</Link>
            <Link to="/about" className="btn-secondary">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="tools-section">
        <div className="tools-content">
          <h2>TOOLS THAT ELEVATE <span>YOUR CRAFT.</span></h2>
          <p>
            Challenging and professional-grade quality is your top priority. 
            Every product is crafted for durability, stability, and superior performance.
          </p>
          <Link to="/about" className="btn-gold">Learn More</Link>
        </div>
        <div className="tools-grid">
          <div className="tool-card">
            <div className="tool-icon">⚡</div>
            <h3>PROFESSIONAL QUALITY</h3>
            <p>But with premium materials, long-lasting performance.</p>
          </div>
          <div className="tool-card">
            <div className="tool-icon">💰</div>
            <h3>PRICE COMPARISON</h3>
            <p>Designed with precision to protect balance and safety.</p>
          </div>
          <div className="tool-card">
            <div className="tool-icon">🛡️</div>
            <h3>HOLD THE LAST?</h3>
            <p>Double and reduce risk for every professional athlete.</p>
          </div>
          <div className="tool-card">
            <div className="tool-icon">🏭</div>
            <h3>INDUSTRIAL GRADE 98%</h3>
            <p>Engineered for craft with utmost safety and durability.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-item">
          <h3>150+</h3>
          <p>PREMIUM PRODUCTS</p>
        </div>
        <div className="stat-item">
          <h3>10,000+</h3>
          <p>HAPPY CUSTOMERS</p>
        </div>
        <div className="stat-item">
          <h3>25+</h3>
          <p>YEARS OF TRUST</p>
        </div>
        <div className="stat-item">
          <h3>100%</h3>
          <p>QUALITY GUARANTEE</p>
        </div>
      </section>
    </div>
  );
};

export default Home;