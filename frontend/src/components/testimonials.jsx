// src/components/testimonials.jsx
import React from 'react';
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
  return (
    <div className="testimonials">
      <div className="testimonials-header">
        <h1>CHEFSET</h1>
        <h2>TRUSTED BY PROFESSIONALS</h2>
        <p>Hear what our customers have to say about their experience with Chefset</p>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <div className="testimonial-card" key={testimonial.id}>
            <div className="testimonial-stars">
              {'⭐'.repeat(testimonial.rating)}
            </div>
            <p className="testimonial-text">"{testimonial.text}"</p>
            <div className="testimonial-author">
              <h4>{testimonial.name}</h4>
              <p>{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;