import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus, FaSearch, FaHeadset, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import './faq.css';

const faqData = [
  { id: 1, question: 'What is Chefset?', answer: 'Chefset is a premium kitchen equipment brand trusted by professional chefs and cooking enthusiasts worldwide. We offer high-quality, durable, and innovative products designed to elevate your cooking experience.' },
  { id: 2, question: 'Are Chefset products suitable for professional use?', answer: 'Absolutely. Our products are built to withstand the demands of professional kitchens while also being perfect for everyday home cooking.' },
  { id: 3, question: 'What materials are used in Chefset products?', answer: 'We use premium materials such as stainless steel, cast iron, and hard-anodized aluminum to ensure durability, even heat distribution, and long-lasting performance.' },
  { id: 4, question: 'How do I care for my Chefset products?', answer: 'Most items can be hand washed or are dishwasher safe. Please refer to the care instructions included with your product for specific cleaning and maintenance guidance.' },
  { id: 5, question: 'Do you offer international shipping?', answer: 'Yes, we offer international shipping to over 50 countries worldwide. Shipping costs and delivery times vary depending on your location.' },
  { id: 6, question: 'What is your return policy?', answer: 'We offer a 30-day return policy on all products. If you are not completely satisfied with your purchase, you can return it within 30 days for a full refund.' },
  { id: 7, question: 'How long does shipping take?', answer: 'Domestic orders typically arrive within 3-5 business days, while international orders may take 7-14 business days depending on the destination.' },
  { id: 8, question: 'Where can I find product manuals or guides?', answer: 'Product manuals and care guides are available on each product page under the "Downloads" section, or you can contact our support team for a copy.' }
];

const INITIAL_COUNT = 4;

const FAQ = () => {
  const [activeId, setActiveId] = useState(1);
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const toggleFAQ = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  const filteredFaqs = faqData.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase())
  );

  // Jab search chal rahi ho to sab results dikhao, warna "View All" logic apply karo
  const visibleFaqs =
    search.trim() !== ''
      ? filteredFaqs
      : showAll
      ? filteredFaqs
      : filteredFaqs.slice(0, INITIAL_COUNT);

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="faq">
      {/* Hero Section */}
      <div
        className="faq-hero"
        style={{ backgroundImage: `url(/images/hero.png)` }}
      >
        <div className="faq-hero-overlay">
          <span className="faq-tag">FAQ</span>
          <h1>
            FREQUENTLY <br />
            <span>ASKED QUESTIONS</span>
          </h1>
          <p>Find answers to the most common questions about ChefSet products, orders, shipping, and more.</p>

          <div className="faq-search">
            <input
              type="text"
              placeholder="Search for answers..."
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

      <div className="faq-content">
        <div className="faq-category">
          <span>GENERAL QUESTIONS</span>
        </div>

        <div className="faq-container">
          {visibleFaqs.map((item) => (
            <div
              className={`faq-item ${activeId === item.id ? 'active' : ''}`}
              key={item.id}
            >
              <div className="faq-question" onClick={() => toggleFAQ(item.id)}>
                <h3>{item.question}</h3>
                <span className="faq-icon">
                  {activeId === item.id ? <FaMinus /> : <FaPlus />}
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

        {/* View All / Show Less button - sirf tab dikhega jab search khaali ho aur 4 se zyada faqs hon */}
        {search.trim() === '' && faqData.length > INITIAL_COUNT && (
          <div className="faq-viewall-wrapper">
            <button
              className="faq-viewall-btn"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? 'SHOW LESS' : 'VIEW ALL'}
            </button>
          </div>
        )}

        <div className="faq-contact">
          <div className="faq-contact-left">
            <div className="faq-contact-icon">
              <FaHeadset />
            </div>
            <div>
              <h3>STILL HAVE QUESTIONS?</h3>
              <p>Our support team is ready to help you with any questions you have.</p>
            </div>
          </div>

          <div className="faq-contact-right">
            <div className="faq-contact-option">
              <FaEnvelope className="faq-contact-option-icon" />
              <div>
                <h4>Email Us</h4>
                <p>support@chefset.com</p>
                <span>We reply within 24 hours</span>
              </div>
            </div>

            <div className="faq-contact-option">
              <FaPhoneAlt className="faq-contact-option-icon" />
              <div>
                <h4>Call Us</h4>
                <p>+1 (800) 123-4567</p>
                <span>Mon - Fri, 9AM - 6PM</span>
              </div>
            </div>
          </div>

          <button className="faq-contact-btn" onClick={handleContactClick}>
            CONTACT US
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;