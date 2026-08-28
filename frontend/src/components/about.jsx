// src/components/about.jsx
import React from 'react';
import {
  FaGem,
  FaLightbulb,
  FaTrophy,
  FaShieldAlt,
  FaHandshake,
  FaMedal,
  FaHeadset,
  FaUserFriends,
  FaBoxOpen,
  FaGlobeAmericas
} from 'react-icons/fa';
import './about.css';

const About = () => {
  return (
    <div className="about">
      {/* Hero Section */}
      <div
        className="about-hero"
        style={{
          backgroundImage: "url('/images/chi1.png')"
        }}
      >
        <div className="about-hero-content">
          <span className="about-tag">ABOUT US</span>
          <h1>
            BUILT FOR CHEFS. <br />
            <span>DRIVEN BY PASSION.</span>
          </h1>
          <p>
            Chefset is more than just a brand — it's our commitment to every
            chef who strives for perfection. We create premium kitchen
            equipment that combines professional quality, innovative design,
            and unmatched durability.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="about-story">
        <div className="about-story-image">
          <img src="/images/chi2.png" alt="Chef at work" />
        </div>

        <div className="about-story-text">
          <span className="about-eyebrow">OUR STORY</span>
          <h2>A LEGACY OF QUALITY</h2>
          <p>
            Chefset was founded by professional chefs who understood the
            importance of quality tools in the kitchen. From the very first
            product, our mission has remained the same.
          </p>
          <p>
            We set out to create high-quality kitchen equipment that meets
            the demands of professionals and home cooks alike, without
            compromise on durability or design.
          </p>
          <p>
            Today, Chefset is proud to be a trusted name in kitchen tools —
            delivering excellence in every kitchen we're a part of.
          </p>
        </div>

        <div className="about-story-side">
          <span className="about-eyebrow">OUR MISSION</span>
          <h2>ELEVATING EVERY CULINARY EXPERIENCE</h2>
          <p>
            Our mission is to provide chefs and cooking enthusiasts with the
            highest quality equipment that enhances their craft and elevates
            their culinary creations.
          </p>

          <div className="about-features">
            <div className="about-feature">
              <FaMedal className="feature-icon" />
              <div>
                <h4>Premium Quality</h4>
                <p>Uncompromising standards of quality</p>
              </div>
            </div>
            <div className="about-feature">
              <FaShieldAlt className="feature-icon" />
              <div>
                <h4>Trust &amp; Reliability</h4>
                <p>Built to last, trusted by professionals</p>
              </div>
            </div>
            <div className="about-feature">
              <FaLightbulb className="feature-icon" />
              <div>
                <h4>Innovative</h4>
                <p>Constantly improving and evolving</p>
              </div>
            </div>
            <div className="about-feature">
              <FaHeadset className="feature-icon" />
              <div>
                <h4>Customer Focus</h4>
                <p>Your satisfaction is our priority</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Principles Section */}
      <div className="about-principles">
        <span className="about-eyebrow center">OUR VALUES</span>
        <h2 className="center">THE PRINCIPLES THAT GUIDE US</h2>

        <div className="principles-grid">
          <div className="principle-card">
            <FaGem className="principle-icon" />
            <h4>QUALITY</h4>
            <p>Uncompromising standards in every product created</p>
          </div>
          <div className="principle-card">
            <FaLightbulb className="principle-icon" />
            <h4>INNOVATION</h4>
            <p>Continuously improving and evolving our designs</p>
          </div>
          <div className="principle-card">
            <FaHandshake className="principle-icon" />
            <h4>TRUST</h4>
            <p>Building lasting relationships with our customers</p>
          </div>
          <div className="principle-card">
            <FaTrophy className="principle-icon" />
            <h4>EXCELLENCE</h4>
            <p>Striving for perfection in everything we do</p>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="about-tools">
        <div className="about-tools-text">
          <span className="about-eyebrow">WHY CHOOSE CHEFSET?</span>
          <h2>TOOLS THAT MAKE A DIFFERENCE</h2>
          <ul>
            <li>Premium materials for superior performance</li>
            <li>Ergonomic designs for comfort and efficiency</li>
            <li>Rigorous testing for reliability and safety</li>
            <li>Designed for professionals, perfect for everyone</li>
          </ul>
        </div>

        <div className="about-tools-image">
          <img src="/images/chi3.png" alt="Kitchen tools" />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="about-stats">
        <div className="stat-item">
          <FaUserFriends className="stat-icon" />
          <div>
            <h3>25+</h3>
            <p>Years of Experience</p>
          </div>
        </div>
        <div className="stat-item">
          <FaBoxOpen className="stat-icon" />
          <div>
            <h3>10,000+</h3>
            <p>Happy Customers</p>
          </div>
        </div>
        <div className="stat-item">
          <FaTrophy className="stat-icon" />
          <div>
            <h3>150+</h3>
            <p>Premium Products</p>
          </div>
        </div>
        <div className="stat-item">
          <FaGlobeAmericas className="stat-icon" />
          <div>
            <h3>50+</h3>
            <p>Countries Served</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;