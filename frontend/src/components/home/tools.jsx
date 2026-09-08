// src/components/home/tools.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../../config';
import './tools.css';

const Tools = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/home-craft`);
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching craft data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="tools-section">
        <div className="tools-loading">Loading...</div>
      </section>
    );
  }

  if (!data) return null;

  const features = [...data.features].sort((a, b) => a.order - b.order);

  // Icon mapping
  const getIcon = (iconName) => {
    const icons = {
      quality: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      price: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v12M15 9.5c0-1.38-1.34-2.5-3-2.5s-3 1.12-3 2.5 1.34 2.5 3 2.5 3 1.12 3 2.5-1.34 2.5-3 2.5-3-1.12-3-2.5" />
        </svg>
      ),
      safety: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
        </svg>
      ),
      industrial: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 20h20M4 20V10l4-3 4 3v10M12 20V6l4-3 4 3v14" />
        </svg>
      )
    };
    return icons[iconName] || icons.quality;
  };

  return (
    <section className="tools-section">
      <div className="tools-content">
        <h2>
          {data.title.split('YOUR CRAFT.')[0]}
          <span>YOUR CRAFT.</span>
        </h2>
        <p>{data.description}</p>
        <Link to={data.buttonLink || '/about'} className="btn-gold">
          {data.buttonText || 'Learn More'}
        </Link>
      </div>

      <div className="tools-grid">
        {features.map((feature, index) => (
          <div className="tool-card" key={index}>
            <div className="tool-icon">
              {getIcon(feature.icon)}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tools;