// src/components/home/hero.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL, STORAGE_URL } from '../../../config';
import './hero.css';

const Hero = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await fetch(`${API_URL}/home-hero`);
        const data = await response.json();
        setHero(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hero:', error);
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  if (loading) {
    return (
      <section className="hero">
        <div className="hero-loading">Loading...</div>
      </section>
    );
  }

  if (!hero) return null;

  return (
    <section 
      className="hero"
      style={{
        backgroundImage: `url(${STORAGE_URL}/${hero.image})`
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>
          {hero.title} <span>{hero.subtitle}</span>
        </h1>
        <p className="hero-description">{hero.description}</p>
        <div className="hero-buttons">
          <Link to={hero.primaryButton?.link || '/products'} className="hero-btn-primary">
            {hero.primaryButton?.text || 'EXPLORE PRODUCTS'}
          </Link>
          <Link to={hero.secondaryButton?.link || '/about'} className="hero-btn-secondary">
            {hero.secondaryButton?.text || 'DISCOVER CRAFT'}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;