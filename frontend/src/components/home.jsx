// src/components/home.jsx
import React from 'react';
import Hero from './home/hero';
import Recent from './recent';  // ← Import Recent
import Stats from './home/stats';
import Tools from './home/tools';

import './home.css';

const Home = () => {
  return (
    <div className="home">
      <Hero />
      <Recent />   {/* ← Recent yahan add karo, Stats se pehle */}
      <Stats />
      <Tools />
    </div>
  );
};

export default Home;