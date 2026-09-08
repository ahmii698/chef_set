// src/components/FAQ.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus, FaSearch, FaHeadset, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { API_URL, STORAGE_URL } from '../../../config';
import './faq.css';

const FAQ = () => {
  const navigate = useNavigate();
  
  // ===== STATE =====
  const [header, setHeader] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [faqInfo, setFaqInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 4;

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [headerRes, faqsRes, infoRes] = await Promise.all([
          fetch(`${API_URL}/faq-header`),
          fetch(`${API_URL}/faqs`),
          fetch(`${API_URL}/faq-info`)
        ]);

        const headerData = await headerRes.json();
        const faqsData = await faqsRes.json();
        const infoData = await infoRes.json();

        setHeader(headerData);
        setFaqs(faqsData);
        setFaqInfo(infoData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ===== TOGGLE FAQ =====
  const toggleFAQ = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  // ===== FILTER FAQS =====
  const filteredFaqs = faqs.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase())
  );

  const visibleFaqs =
    search.trim() !== ''
      ? filteredFaqs
      : showAll
      ? filteredFaqs
      : filteredFaqs.slice(0, INITIAL_COUNT);

  // ===== HANDLERS =====
  const handleContactClick = () => {
    navigate('/contact');
  };

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="faq">
        <div className="faq-loading">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="faq">
      {/* ===== HERO SECTION ===== */}
      {header && (
        <div
          className="faq-hero"
          style={{ backgroundImage: `url(${STORAGE_URL}/${header.image})` }}
        >
          <div className="faq-hero-overlay">
            <span className="faq-tag">{header.title}</span>
            <h1>
              {header.subtitle.split('ASKED QUESTIONS')[0]}
              <br />
              <span>ASKED QUESTIONS</span>
            </h1>
            <p>{header.description}</p>

            <div className="faq-search">
              <input
                type="text"
                placeholder={header.searchPlaceholder || 'Search for answers...'}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowAll(false);
                }}
              />
              <button type="button" aria-label="Search">
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="faq-content">
        <div className="faq-category">
          <span>GENERAL QUESTIONS</span>
        </div>

        {/* ===== FAQ LIST ===== */}
        <div className="faq-container">
          {visibleFaqs.map((item) => (
            <div
              className={`faq-item ${activeId === item._id ? 'active' : ''}`}
              key={item._id}
            >
              <div className="faq-question" onClick={() => toggleFAQ(item._id)}>
                <h3>{item.question}</h3>
                <span className="faq-icon">
                  {activeId === item._id ? <FaMinus /> : <FaPlus />}
                </span>
              </div>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <p className="faq-no-results">No questions found matching your search.</p>
          )}
        </div>

        {/* ===== VIEW ALL / SHOW LESS ===== */}
        {search.trim() === '' && faqs.length > INITIAL_COUNT && (
          <div className="faq-viewall-wrapper">
            <button
              className="faq-viewall-btn"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? 'SHOW LESS' : 'VIEW ALL'}
            </button>
          </div>
        )}

        {/* ===== FAQ CONTACT / INFO ===== */}
        {faqInfo && (
          <div className="faq-contact">
            <div className="faq-contact-left">
              <div className="faq-contact-icon">
                <FaHeadset />
              </div>
              <div>
                <h3>{faqInfo.title || 'STILL HAVE QUESTIONS?'}</h3>
                <p>{faqInfo.description || 'Our support team is ready to help you with any questions you have.'}</p>
              </div>
            </div>

            <div className="faq-contact-right">
              {faqInfo.contactInfo && faqInfo.contactInfo.map((item, index) => (
                <div className="faq-contact-option" key={index}>
                  {item.icon === 'email' && <FaEnvelope className="faq-contact-option-icon" />}
                  {item.icon === 'phone' && <FaPhoneAlt className="faq-contact-option-icon" />}
                  <div>
                    <h4>{item.label}</h4>
                    {item.link ? (
                      <a href={item.link} className="faq-contact-link">{item.value}</a>
                    ) : (
                      <p>{item.value}</p>
                    )}
                    <span>{item.subtext}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="faq-contact-btn" onClick={handleContactClick}>
              {faqInfo.buttonText || 'CONTACT US'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;