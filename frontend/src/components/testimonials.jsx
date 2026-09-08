// src/components/testimonials.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { API_URL } from '../../config';
import './testimonials.css';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  const viewportRef = useRef(null);
  const cardRef = useRef(null);

  // ===== FETCH TESTIMONIALS =====
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_URL}/testimonials`);
        if (!response.ok) throw new Error('Failed to fetch testimonials');
        const data = await response.json();
        setTestimonials(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const maxIndex = Math.max(testimonials.length - visibleCount, 0);

  // ===== UPDATE VISIBLE COUNT =====
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

  // ===== MEASURE CARD WIDTH =====
  const measureCardWidth = useCallback(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const style = window.getComputedStyle(cardRef.current);
      const marginRight = parseFloat(style.marginRight) || 0;
      const marginLeft = parseFloat(style.marginLeft) || 0;
      setCardWidth(rect.width + marginRight + marginLeft);
    }
  }, []);

  // ===== RESIZE EFFECTS =====
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
    setIndex((prev) => Math.min(prev, Math.max(testimonials.length - visibleCount, 0)));
  }, [visibleCount, testimonials.length]);

  // ===== NAVIGATION =====
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

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="testimonials">
        <div className="testimonials-header">
          <div className="testimonials-overline">
            <span className="overline-line"></span>
            <span className="overline-text">TRUSTED BY PROFESSIONALS</span>
            <span className="overline-line"></span>
          </div>
          <h1 className="testimonials-title">
            AROUND <span className="highlight">THE WORLD.</span>
          </h1>
          <p>Loading testimonials...</p>
        </div>
      </div>
    );
  }

  if (!testimonials.length) {
    return (
      <div className="testimonials">
        <div className="testimonials-header">
          <div className="testimonials-overline">
            <span className="overline-line"></span>
            <span className="overline-text">TRUSTED BY PROFESSIONALS</span>
            <span className="overline-line"></span>
          </div>
          <h1 className="testimonials-title">
            AROUND <span className="highlight">THE WORLD.</span>
          </h1>
          <p>No testimonials available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="testimonials">
      <div className="testimonials-header">
        <div className="testimonials-overline">
          <span className="overline-line"></span>
          <span className="overline-text">TRUSTED BY PROFESSIONALS</span>
          <span className="overline-line"></span>
        </div>
        <h1 className="testimonials-title">
          AROUND <span className="highlight">THE WORLD.</span>
        </h1>
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
            {testimonials.map((testimonial, i) => {
              const cardStyle = {
                flex: `0 0 calc(${100 / visibleCount}% - ${(1 * (visibleCount - 1)) / visibleCount}rem)`
              };

              return (
                <div
                  className="testimonial-card"
                  key={testimonial._id}
                  ref={i === 0 ? cardRef : null}
                  style={cardStyle}
                >
                  <div className="testimonial-author">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>

                  <p className="testimonial-text">"{testimonial.text}"</p>

                  <div className="testimonial-stars">
                    {[...Array(testimonial.rating || 5)].map((_, s) => (
                      <FaStar key={s} className="star-icon" />
                    ))}
                  </div>
                </div>
              );
            })}
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

      {/* Dots */}
      {maxIndex > 0 && (
        <div className="testimonials-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <span
              key={i}
              className={`dot ${i === index ? 'active' : ''}`}
              onClick={() => goTo(i)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Testimonials;