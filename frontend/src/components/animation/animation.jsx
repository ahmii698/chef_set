// src/components/animation/animation.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL, STORAGE_URL } from "../../../config";
import "./animation.css";

const CategoryAccordion = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(2); // default open panel

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/home-category`);
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="category-section">
        <div className="heading-glow"></div>
        <h2 className="category-heading">Loading...</h2>
      </section>
    );
  }

  if (!data) return null;

  // Sort categories by order
  const categories = [...data.categories].sort((a, b) => a.order - b.order);

  return (
    <section className="category-section">
      <div className="heading-glow"></div>
      <h2 className="category-heading">{data.title}</h2>

      <div className="accordion-wrapper">
        {categories.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={index}
              className={`accordion-item ${isActive ? "active" : ""}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              style={{ backgroundImage: `url(${STORAGE_URL}/${item.image})` }}
            >
              <div className="overlay"></div>

              {/* Collapsed state: vertical title */}
              {!isActive && (
                <span className="vertical-title">{item.name}</span>
              )}

              {/* Expanded state: full info */}
              {isActive && (
                <div className="active-content">
                  <span className="collection-label">{data.subtitle}</span>
                  <h3 className="active-title">{item.name}</h3>
                  <Link to={item.link} className="shop-now-btn">
                    {item.buttonText || "SHOP NOW"} <span className="arrow">↗</span>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryAccordion;