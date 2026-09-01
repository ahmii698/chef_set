// src/components/home/stats.jsx
import React from 'react';
import './stats.css';

const Stats = () => {
  return (
    <section className="home-stats-section">
      <div className="home-stat-item">
        <h3>150+</h3>
        <p>PREMIUM PRODUCTS</p>
      </div>
      <div className="home-stat-item">
        <h3>10,000+</h3>
        <p>HAPPY CUSTOMERS</p>
      </div>
      <div className="home-stat-item">
        <h3>25+</h3>
        <p>YEARS OF TRUST</p>
      </div>
      <div className="home-stat-item">
        <h3>100%</h3>
        <p>QUALITY GUARANTEE</p>
      </div>
    </section>
  );
};

export default Stats;