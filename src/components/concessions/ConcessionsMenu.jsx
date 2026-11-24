import React, { useState } from 'react';
import { useCinema } from '../../context/CinemaContext';
import { PopcornIcon, PlusIcon, MinusIcon, TicketIcon, CheckIcon } from '../common/Icons';

const ConcessionsMenu = () => {
  const { concessions, notify, movies, setBookingMovie } = useCinema();
  const [activeCategory, setActiveCategory] = useState('All');
  const [tray, setTray] = useState({});
  const categories = ['All', 'Popcorn', 'Combos', 'Beverages', 'Snacks'];

  const filtered = activeCategory === 'All' 
    ? concessions 
    : concessions.filter(c => c.category === activeCategory);

  const handleUpdateQty = (item, delta) => {
    const currentQty = tray[item.id]?.qty || 0;
    const newQty = Math.max(0, currentQty + delta);

    if (newQty === 0) {
      const nextTray = { ...tray };
      delete nextTray[item.id];
      setTray(nextTray);
    } else {
      setTray({
        ...tray,
        [item.id]: {
          ...item,
          qty: newQty
        }
      });
    }

    if (delta > 0 && currentQty === 0) {
      notify(
        'Added to Tray',
        `${item.name} ($${item.price.toFixed(2)}) is added to your cinema refreshments tray.`,
        'info'
      );
    }
  };

  const trayList = Object.values(tray);
  const totalTrayCount = trayList.reduce((sum, item) => sum + item.qty, 0);
  const totalTrayPrice = trayList.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleProceedWithTickets = () => {
    if (movies.length > 0) {
      setBookingMovie(movies[0]);
      notify('Concessions Tray Attached', 'Selected refreshments will be added to your reservation.');
    }
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
          Warm, artisanal popcorn tossed in black truffle oil, ice-cold craft sodas, and curated cinephile combos delivered hot & fresh to your auditorium seat.
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
        {filtered.map((item) => {
          const inTrayQty = tray[item.id]?.qty || 0;

          return (
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
                <span className="dietary-tag">{item.dietary}</span>
                
                <div className="concession-footer">
                  <span className="concession-price">${item.price.toFixed(2)}</span>
                  
                  {inTrayQty === 0 ? (
                    <button 
                      className="btn-order-concession"
                      onClick={() => handleUpdateQty(item, 1)}
                    >
                      <PlusIcon size={16} />
                      <span>Quick Add</span>
                    </button>
                  ) : (
                    <div className="concession-qty-stepper">
                      <button 
                        className="stepper-btn"
                        onClick={() => handleUpdateQty(item, -1)}
                        aria-label="Decrease quantity"
                      >
                        <MinusIcon size={14} />
                      </button>
                      <span className="stepper-qty">{inTrayQty}</span>
                      <button 
                        className="stepper-btn"
                        onClick={() => handleUpdateQty(item, 1)}
                        aria-label="Increase quantity"
                      >
                        <PlusIcon size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Floating Concessions Summary Bar */}
      {totalTrayCount > 0 && (
        <div className="floating-concessions-tray">
          <div className="tray-info">
            <PopcornIcon size={24} className="text-gold" />
            <div>
              <span className="tray-title">Refreshment Tray ({totalTrayCount} items)</span>
              <span className="tray-price">Total: ${totalTrayPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="tray-actions">
            <button className="tray-clear-btn" onClick={() => setTray({})}>
              Clear
            </button>
            <button className="tray-checkout-btn" onClick={handleProceedWithTickets}>
              <TicketIcon size={18} />
              <span>Book Seats with Tray</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ConcessionsMenu;
