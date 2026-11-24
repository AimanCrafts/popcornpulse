// src/components/concessions/ConcessionsMenu.jsx
import React, { useState } from 'react';
import { useCinema } from '../../context/CinemaContext';
import { PopcornIcon, PlusIcon } from '../common/Icons';

const ConcessionsMenu = () => {
  const { concessions, notify } = useCinema();
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Popcorn', 'Combos', 'Beverages', 'Snacks'];

  const filtered = activeCategory === 'All' 
    ? concessions 
    : concessions.filter(c => c.category === activeCategory);

  const handleAddSnack = (item) => {
    notify(
      'Added to Order',
      `${item.name} ($${item.price.toFixed(2)}) is added to your concession tray.`,
      'info'
    );
  };

  return (
    <section className="concessions-section">
      <div className="section-header-box">
        <div className="section-tagline">
          <PopcornIcon size={20} className="text-neon-gold" />
          <span>POPCORNPULSE CONCESSION BAR</span>
        </div>
        <h2 className="section-main-heading">Gourmet Cinema Refreshments</h2>
        <p className="section-description">
          Warm, artisanal popcorn tossed in black truffle oil, ice-cold specialty drinks, and curated cinephile combos delivered hot & fresh to your auditorium seat.
        </p>

        {/* Category Pills */}
        <div className="concession-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of snacks */}
      <div className="concessions-grid">
        {filtered.map((item) => (
          <article key={item.id} className="concession-card">
            <div className="concession-image-box">
              <img src={item.image} alt={item.name} className="concession-img" loading="lazy" />
              {item.badge && <span className="concession-badge">{item.badge}</span>}
            </div>
            
            <div className="concession-body">
              <div className="concession-meta">
                <span className="concession-cat">{item.category}</span>
                <span className="concession-cal">{item.calories}</span>
              </div>
              
              <h3 className="concession-title">{item.name}</h3>
              <p className="concession-desc">{item.description}</p>
              
              <div className="concession-footer">
                <span className="concession-price">${item.price.toFixed(2)}</span>
                <button 
                  className="btn-order-concession"
                  onClick={() => handleAddSnack(item)}
                >
                  <PlusIcon size={16} />
                  <span>Quick Add</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ConcessionsMenu;
