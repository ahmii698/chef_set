import React, { useState } from "react";
import "./animation.css";

const categories = [
  {
    title: "Knives",
    image: "/images/cs1.jpg", 
    link: "/category/knives",
  },
  {
    title: "Chopping Boards",
    image: "/images/cs2.jpg",
    link: "/category/chopping-boards",
  },
  {
    title: "Cookware",
    image: "/images/chi1.png",
    link: "/category/cookware",
  },
  {
    title: "Utensils",
    image: "/images/cs3.jpg",
    link: "/category/utensils",
  },
  {
    title: "Storage",
    image: "/images/cs4.jpg",
    link: "/category/storage",
  },
];

export default function CategoryAccordion() {
  const [activeIndex, setActiveIndex] = useState(2); // default open panel

  return (
    <section className="category-section">
      <div className="heading-glow"></div>
      <h2 className="category-heading">Shop by Category</h2>

      <div className="accordion-wrapper">
        {categories.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={index}
              className={`accordion-item ${isActive ? "active" : ""}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="overlay"></div>

              {/* Collapsed state: vertical title */}
              {!isActive && (
                <span className="vertical-title">{item.title}</span>
              )}

              {/* Expanded state: full info */}
              {isActive && (
                <div className="active-content">
                  <span className="collection-label">COLLECTIONS</span>
                  <h3 className="active-title">{item.title}</h3>
                  <a href={item.link} className="shop-now-btn">
                    SHOP NOW <span className="arrow">↗</span>
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}