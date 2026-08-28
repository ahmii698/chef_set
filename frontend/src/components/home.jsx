// src/components/home.jsx
import React from 'react';
import Hero from './home/hero';
import Recent from './recent';
import Stats from './home/stats';
import Tools from './home/tools';
import Testimonials from './testimonials';  // Import Testimonials

import './home.css';

const Home = () => {
  return (
    <div className="home">
      <Hero />
      <Recent />
      <Stats />
      <Tools />
      <Testimonials />  {/* Testimonials yahan add karo - Tools ke neeche */}
    </div>
  );
};

export default Home;