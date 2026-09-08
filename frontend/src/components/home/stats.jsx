// src/components/home/stats.jsx
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config';
import './stats.css';

const Stats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/home-stats`);
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="home-stats-section">
        <div className="home-stats-loading">Loading...</div>
      </section>
    );
  }

  if (!data) return null;

  const stats = [...data.stats].sort((a, b) => a.order - b.order);

  return (
    <section className="home-stats-section">
      {stats.map((stat, index) => (
        <div className="home-stat-item" key={index}>
          <h3>{stat.number}</h3>
          <p>{stat.label}</p>
        </div>
      ))}
    </section>
  );
};

export default Stats;