// src/components/home.jsx
import React from 'react';
import Hero from './home/hero';
import MouseAnimation from './mouse_animation/mouse_animation'; 
import Animation from './animation/animation';
import HomeAbout from './home-about/home-about';
import Recent from './recent';
import Stats from './home/stats';
import Tools from './home/tools';
import Testimonials from './testimonials';
import './home.css';

const Home = () => {
  return (
    <div className="home">
      <MouseAnimation />
      <Hero />
       <Animation />
       <Recent />
      <HomeAbout />
       
      <Stats />
     

     
     
      <Tools />
      <Testimonials />
    </div>
  );
};

export default Home;