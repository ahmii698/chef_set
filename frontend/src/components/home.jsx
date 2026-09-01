// src/components/home.jsx
import React from 'react';
import Hero from './home/hero';
import CategoryAccordion from './animation/animation'; // yahan import karo
import Recent from './recent';
import Stats from './home/stats';
import Tools from './home/tools';
import Testimonials from './testimonials';
import './home.css';

const Home = () => {
  return (
    <div className="home">
      <Hero />
      <CategoryAccordion />   {/* Hero ke neeche, Recent se pehle */}
      <Stats />
      <Recent />
      <Tools />
      <Testimonials />
    </div>
  );
};

export default Home;