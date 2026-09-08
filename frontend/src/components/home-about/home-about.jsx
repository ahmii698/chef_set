// src/components/home-about/home-about.jsx
import React, { useState, useEffect } from 'react';
import { API_URL, STORAGE_URL } from '../../../config';
import './home-about.css';

const HomeAbout = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/about-story`);
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching about story:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="home-about">
        <div className="home-about-loading">Loading...</div>
      </div>
    );
  }

  if (!data) return null;

  // Split description into paragraphs
  const paragraphs = data.description ? data.description.split('\n\n') : [];

  return (
    <div className="home-about">
      <div className="home-about-text">
        <span className="home-about-eyebrow">{data.title}</span>
        <h2>{data.subtitle}</h2>
        {paragraphs.map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </div>

      <div className="home-about-image">
        <img 
          src={`${STORAGE_URL}/${data.image}`} 
          alt={data.title || 'About Us'} 
        />
      </div>
    </div>
  );
};

export default HomeAbout;