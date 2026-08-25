// src/components/about.jsx
import React from 'react';
import './about.css';

const About = () => {
  return (
    <div className="about">
      <div className="about-hero">
        <h1>CHEFSET</h1>
        <h2>TRUSTED BY PROFESSIONALS</h2>
        <p>
          For over 25 years, Chefset has been the choice of professional chefs 
          and cooking enthusiasts worldwide. Our commitment to quality and 
          innovation has made us a trusted name in premium kitchen equipment.
        </p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h3>Our Story</h3>
          <p>
            Founded by professional chefs who understood the importance of 
            quality tools in the kitchen, Chefset was created to fill a gap 
            in the market for premium, reliable kitchen equipment. Today, 
            we continue that legacy with every product we make.
          </p>
        </div>

        <div className="about-section">
          <h3>Our Mission</h3>
          <p>
            To provide chefs and cooking enthusiasts with the highest quality 
            kitchen equipment that enhances their craft and elevates their 
            culinary creations.
          </p>
        </div>

        <div className="about-values">
          <div className="value-item">
            <h4>🔹 Quality</h4>
            <p>Uncompromising standards in every product</p>
          </div>
          <div className="value-item">
            <h4>🔹 Innovation</h4>
            <p>Continuously improving and evolving our designs</p>
          </div>
          <div className="value-item">
            <h4>🔹 Trust</h4>
            <p>Building lasting relationships with our customers</p>
          </div>
          <div className="value-item">
            <h4>🔹 Excellence</h4>
            <p>Striving for perfection in everything we do</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;