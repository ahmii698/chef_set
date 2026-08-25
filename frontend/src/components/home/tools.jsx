// src/components/home/tools.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './tools.css';

const Tools = () => {
  return (
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
          <div className="tool-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <h3>PROFESSIONAL QUALITY</h3>
          <p>Premium materials for long-lasting performance</p>
        </div>
        <div className="tool-card">
          <div className="tool-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v12M15 9.5c0-1.38-1.34-2.5-3-2.5s-3 1.12-3 2.5 1.34 2.5 3 2.5 3 1.12 3 2.5-1.34 2.5-3 2.5-3-1.12-3-2.5" />
            </svg>
          </div>
          <h3>PRICE COMPARISON</h3>
          <p>Designed with precision to protect balance and safety</p>
        </div>
        <div className="tool-card">
          <div className="tool-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
            </svg>
          </div>
          <h3>SAFETY FIRST</h3>
          <p>Double and reduce risk for every professional</p>
        </div>
        <div className="tool-card">
          <div className="tool-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 20h20M4 20V10l4-3 4 3v10M12 20V6l4-3 4 3v14" />
            </svg>
          </div>
          <h3>INDUSTRIAL GRADE</h3>
          <p>Engineered with utmost safety and durability</p>
        </div>
      </div>
    </section>
  );
};

export default Tools;