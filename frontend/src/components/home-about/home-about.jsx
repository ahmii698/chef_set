// src/components/home-about/home-about.jsx
import React from 'react';
import './home-about.css';

const HomeAbout = () => {
  return (
    <div className="home-about">
      <div className="home-about-text">
        <span className="home-about-eyebrow">OUR STORY</span>
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

      <div className="home-about-image">
        <img src="/images/chi2.png" alt="Chef at work" />
      </div>
    </div>
  );
};

export default HomeAbout;