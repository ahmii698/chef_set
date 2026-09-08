// src/components/about.jsx
import React, { useState, useEffect } from 'react';
import {
  FaGem,
  FaLightbulb,
  FaTrophy,
  FaShieldAlt,
  FaHandshake,
  FaMedal,
  FaHeadset,
  FaUserFriends,
  FaBoxOpen,
  FaGlobeAmericas
} from 'react-icons/fa';
import { API_URL, STORAGE_URL } from '../../config';
import './about.css';

const About = () => {
  const [header, setHeader] = useState(null);
  const [story, setStory] = useState(null);
  const [values, setValues] = useState(null);
  const [whyChooseUs, setWhyChooseUs] = useState(null);
  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const [
          headerRes,
          storyRes,
          valuesRes,
          whyRes,
          achievementRes
        ] = await Promise.all([
          fetch(`${API_URL}/about-header`),
          fetch(`${API_URL}/about-story`),
          fetch(`${API_URL}/about-values`),
          fetch(`${API_URL}/about-why-choose-us`),
          fetch(`${API_URL}/about-achievement`)
        ]);

        const headerData = await headerRes.json();
        const storyData = await storyRes.json();
        const valuesData = await valuesRes.json();
        const whyData = await whyRes.json();
        const achievementData = await achievementRes.json();

        setHeader(headerData);
        setStory(storyData);
        setValues(valuesData);
        setWhyChooseUs(whyData);
        setAchievement(achievementData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching about data:', error);
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="about">
        <div className="about-loading">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // Helper function to split description into paragraphs
  const renderParagraphs = (text) => {
    if (!text) return null;
    // Split by \n\n or \n or double line breaks
    const paragraphs = text.split(/\n\s*\n/);
    return paragraphs.map((para, index) => (
      <p key={index}>{para.trim()}</p>
    ));
  };

  return (
    <div className="about">
      {/* ==================== HERO SECTION ==================== */}
      {header && (
        <div
          className="about-hero"
          style={{
            backgroundImage: `url(${STORAGE_URL}/${header.image})`
          }}
        >
          <div className="about-hero-overlay">
            <span className="about-tag">{header.heading}</span>
            <h1>
              BUILT FOR CHEFS. <br />
              <span>DRIVEN BY PASSION.</span>
            </h1>
            <p>{header.description}</p>
          </div>
        </div>
      )}

      {/* ==================== STORY SECTION ==================== */}
      {story && (
        <div className="about-story">
          <div className="about-story-image">
            <img src={`${STORAGE_URL}/${story.image}`} alt="Chef at work" />
          </div>

          <div className="about-story-text">
            <span className="about-eyebrow">{story.title}</span>
            <h2>{story.subtitle}</h2>
            {/* ✅ Description with paragraph gaps */}
            {renderParagraphs(story.description)}
          </div>

          <div className="about-story-side">
            <span className="about-eyebrow">{story.missionTitle}</span>
            <h2>{story.missionSubtitle}</h2>
            <p>{story.missionDescription}</p>

            <div className="about-features">
              {story.missionPoints && story.missionPoints.map((point, index) => {
                const [name, desc] = point.split(' - ');
                const iconMap = {
                  'Premium Quality': <FaMedal className="feature-icon" />,
                  'Trust & Reliability': <FaShieldAlt className="feature-icon" />,
                  'Innovative': <FaLightbulb className="feature-icon" />,
                  'Customer Focus': <FaHeadset className="feature-icon" />
                };

                return (
                  <div className="about-feature" key={index}>
                    {iconMap[name] || <FaMedal className="feature-icon" />}
                    <div>
                      <h4>{name}</h4>
                      <p>{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================== VALUES SECTION ==================== */}
      {values && (
        <div className="about-principles">
          <span className="about-eyebrow center">{values.title}</span>
          <h2 className="center">{values.subtitle}</h2>

          <div className="principles-grid">
            {values.values && values.values.map((value, index) => {
              const iconMap = {
                'QUALITY': <FaGem className="principle-icon" />,
                'INNOVATION': <FaLightbulb className="principle-icon" />,
                'TRUST': <FaHandshake className="principle-icon" />,
                'EXCELLENCE': <FaTrophy className="principle-icon" />
              };

              return (
                <div className="principle-card" key={index}>
                  {iconMap[value.name] || <FaGem className="principle-icon" />}
                  <h4>{value.name}</h4>
                  <p>{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== WHY CHOOSE US SECTION ==================== */}
      {whyChooseUs && (
        <div className="about-tools">
          <div className="about-tools-text">
            <span className="about-eyebrow">{whyChooseUs.title}</span>
            <h2>{whyChooseUs.subtitle}</h2>
            <ul>
              {whyChooseUs.points && whyChooseUs.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="about-tools-image">
            <img src={`${STORAGE_URL}/${whyChooseUs.image}`} alt="Kitchen tools" />
          </div>
        </div>
      )}

      {/* ==================== STATS / ACHIEVEMENTS SECTION ==================== */}
      {achievement && (
        <div className="about-stats">
          {achievement.achievements && achievement.achievements.map((stat, index) => {
            const iconMap = {
              'Years of Experience': <FaUserFriends className="stat-icon" />,
              'Happy Customers': <FaBoxOpen className="stat-icon" />,
              'Premium Products': <FaTrophy className="stat-icon" />,
              'Countries Served': <FaGlobeAmericas className="stat-icon" />
            };

            return (
              <div className="stat-item" key={index}>
                {iconMap[stat.label] || <FaUserFriends className="stat-icon" />}
                <div>
                  <h3>{stat.number}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default About;