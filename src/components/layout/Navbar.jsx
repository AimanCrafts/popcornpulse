// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { useCinema } from '../../context/CinemaContext';
import {
  FilmIcon,
  PopcornIcon,
  TicketIcon,
  UsersIcon,
  BarChartIcon,
  HeartIcon,
  SearchIcon,
  SparklesIcon,
  MoonIcon
} from '../common/Icons';

const Navbar = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    watchlist,
    setIsWatchlistOpen,
    setBookingMovie,
    movies,
    cinemaLightsDimmed,
    toggleCinemaLights
  } = useCinema();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'movies', label: 'Movies & Screens', icon: <FilmIcon size={18} /> },
    { id: 'showtimes', label: 'Showtimes & Seats', icon: <TicketIcon size={18} /> },
    { id: 'concessions', label: 'Concessions Bar', icon: <PopcornIcon size={18} /> },
    { id: 'events', label: 'Movie Nights', icon: <UsersIcon size={18} /> },
    { id: 'reviews', label: 'Pulse Reviews', icon: <SparklesIcon size={18} /> },
    { id: 'analytics', label: 'Cinema Analytics', icon: <BarChartIcon size={18} /> },
  ];

  return (
    <header className={`cinematic-navbar ${cinemaLightsDimmed ? 'cinema-dimmed' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => setActiveTab('movies')}>
          <div className="brand-logo-icon">
            <span className="popcorn-emoji">🍿</span>
            <span className="neon-pulse-dot" />
          </div>
          <div className="brand-titles">
            <h1 className="brand-name">
              Popcorn<span className="pulse-text">Pulse</span>
            </h1>
            <span className="brand-badge">CINEMA EXPERIENCE</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <SearchIcon size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search movies, directors, IMAX screens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-tab-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
            >
              <span className="tab-icon">{item.icon}</span>
              <span className="tab-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* Cinema Ambience Mode Toggle */}
          <button
            className={`cinema-mode-toggle ${cinemaLightsDimmed ? 'active' : ''}`}
            onClick={toggleCinemaLights}
            title={cinemaLightsDimmed ? "Turn Auditorium Lights ON" : "Dim Lights (Cinema Mode)"}
          >
            <MoonIcon size={16} />
            <span className="toggle-label">{cinemaLightsDimmed ? 'Lights Dim' : 'Dim'}</span>
          </button>

          {/* Watchlist Button */}
          <button
            className="watchlist-btn"
            onClick={() => setIsWatchlistOpen(true)}
            title="View Saved Watchlist"
          >
            <HeartIcon
              size={18}
              filled={watchlist.length > 0}
              className={watchlist.length > 0 ? 'text-neon-pink' : ''}
            />
            <span className="watchlist-count">{watchlist.length}</span>
          </button>

          {/* Quick Book CTA */}
          <button
            className="quick-book-btn"
            onClick={() => setBookingMovie(movies[0] || null)}
          >
            <TicketIcon size={18} />
            <span>Book Tickets</span>
          </button>

          {/* Mobile hamburger */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
