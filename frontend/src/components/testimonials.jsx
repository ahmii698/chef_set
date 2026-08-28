// src/components/testimonials.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Chef Michael Rodriguez',
    role: 'Executive Chef, Michelin Star Restaurant',
    text: 'Chefset has completely transformed my kitchen. The quality and precision of their tools are unmatched. Every product is a game-changer.',
    rating: 5
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Professional Baker',
    text: 'I\'ve been using Chefset products for over 5 years now. The durability and performance are exceptional. Highly recommended for any serious cook.',
    rating: 5
  },
  {
    id: 3,
    name: 'Chef David Thompson',
    role: 'Culinary Instructor',
    text: 'I recommend Chefset to all my students. The quality-to-price ratio is incredible, and the products last for years.',
    rating: 5
  },
  {
    id: 4,
    name: 'Emma Williams',
    role: 'Home Chef & Food Blogger',
    text: 'These tools have elevated my cooking to a professional level. The design and functionality are perfect for both home and professional use.',
    rating: 5
  }
];

const Testimonials = () => {
  const [visibleCount, setVisibleCount] = useState(3);
  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  const viewportRef = useRef(null);
  const cardRef = useRef(null);

  const maxIndex = Math.max(testimonials.length - visibleCount, 0);

  // Decide how many cards fit based on screen size
  const updateVisibleCount = useCallback(() => {
    const width = window.innerWidth;
    if (width <= 600) {
      setVisibleCount(1);
    } else if (width <= 900) {
      setVisibleCount(2);
    } else {
      setVisibleCount(3);
    }
  }, []);

  // Measure exact rendered card width (includes its own margin/gap)
  const measureCardWidth = useCallback(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const style = window.getComputedStyle(cardRef.current);
      const marginRight = parseFloat(style.marginRight) || 0;
      const marginLeft = parseFloat(style.marginLeft) || 0;
      setCardWidth(rect.width + marginRight + marginLeft);
    }
  }, []);

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [updateVisibleCount]);

  useEffect(() => {
    measureCardWidth();
    window.addEventListener('resize', measureCardWidth);
    return () => window.removeEventListener('resize', measureCardWidth);
  }, [measureCardWidth, visibleCount]);

  useEffect(() => {
    // Clamp index whenever visibleCount changes (e.g. resize)
    setIndex((prev) => Math.min(prev, Math.max(testimonials.length - visibleCount, 0)));
  }, [visibleCount]);

  const goNext = () => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const goPrev = () => {
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goTo = (i) => {
    setIndex(i);
  };

  const trackOffset = cardWidth * index;

  return (
    <div className="testimonials">
      <div className="testimonials-header">
        <h1>TRUSTED BY PROFESSIONALS</h1>
        <h2>AROUND THE WORLD.</h2>
        <p>See what others are saying about our products:</p>
      </div>

      <div className="testimonials-carousel">
        <button
          className="carousel-arrow carousel-arrow-left"
          onClick={goPrev}
          aria-label="Previous testimonial"
        >
          <FaChevronLeft />
        </button>

        <div className="testimonials-viewport" ref={viewportRef}>
          <div
            className="testimonials-track"
            style={{ transform: `translateX(-${trackOffset}px)` }}
          >
            {testimonials.map((testimonial, i) => (
              <div
                className="testimonial-card"
                key={testimonial.id}
                ref={i === 0 ? cardRef : null}
                style={{ flex: `0 0 calc(${100 / visibleCount}% - ${(1 * (visibleCount - 1)) / visibleCount}rem)` }}
              >
                {/* Name - Upar */}
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>

                {/* Testimonial Text - Beech */}
                <p className="testimonial-text">"{testimonial.text}"</p>

                {/* Stars - Neeche */}
                <div className="testimonial-stars">
                  {[...Array(testimonial.rating)].map((_, s) => (
                    <FaStar key={s} className="star-icon" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="carousel-arrow carousel-arrow-right"
          onClick={goNext}
          aria-label="Next testimonial"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="testimonials-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => goTo(i)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;