// src/components/analytics/CinemaAnalytics.jsx
import React from 'react';
import { useCinema } from '../../context/CinemaContext';
import { BarChartIcon, TicketIcon, SparklesIcon, UsersIcon, PopcornIcon } from '../common/Icons';

const CinemaAnalytics = () => {
  const { stats } = useCinema();

  const {
    totalTicketsBooked = 342,
    avgPulseScore = 96,
    activeMovieNights = 4,
    totalReviews = 89,
    totalRsvps = 422,
    genreCounts = { "Sci-Fi": 4, "Action": 3, "Drama": 2, "Animation": 1 },
    topScreenFormat = 'IMAX 70mm Dual Laser',
    auditoriumsOnline = 12
  } = stats || {};

  return (
    <section className="cinema-analytics-section">
      <div className="section-header-box">
        <div className="section-tagline">
          <BarChartIcon size={20} className="text-neon-cyan" />
          <span>REAL-TIME PLATFORM METRICS</span>
        </div>
        <h2 className="section-main-heading">Cinema Pulse Dashboard & Telemetry</h2>
        <p className="section-description">
          Live statistics across tickets issued, attendee sentiment index, auditoriums utilization, and community gatherings.
        </p>
      </div>

      {/* 4 Key Stat Metric Cards */}
      <div className="analytics-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap bg-gold">
            <TicketIcon size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-value">{totalTicketsBooked}</span>
            <span className="kpi-label">Tickets Issued This Week</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap bg-purple">
            <SparklesIcon size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-value">{avgPulseScore}%</span>
            <span className="kpi-label">Platform Pulse Score</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap bg-cyan">
            <UsersIcon size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-value">{totalRsvps}</span>
            <span className="kpi-label">Cinephile Event RSVPs</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap bg-pink">
            <PopcornIcon size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-value">{totalReviews}</span>
            <span className="kpi-label">Verified Audience Critiques</span>
          </div>
        </div>
      </div>

      {/* Detailed Insights Row */}
      <div className="analytics-details-grid">
        {/* Genre Popularity Chart */}
        <div className="analytics-panel">
          <h3>Popular Genres & Community Appetite</h3>
          <div className="genre-bars-list">
            {Object.entries(genreCounts).map(([genre, count]) => {
              const maxCount = Math.max(...Object.values(genreCounts), 1);
              const pct = Math.round((count / maxCount) * 100);

              return (
                <div key={genre} className="genre-bar-row">
                  <div className="bar-labels">
                    <span className="genre-name">{genre}</span>
                    <span className="genre-count">{count} Screenings</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Auditorium Specifications */}
        <div className="analytics-panel">
          <h3>Theater Specifications & Formats</h3>
          <div className="tech-specs-list">
            <div className="spec-item">
              <span className="spec-label">Premier Format:</span>
              <span className="spec-val highlight-gold">{topScreenFormat}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Active Auditoriums:</span>
              <span className="spec-val">{auditoriumsOnline} Theaters Linked</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Audio Standards:</span>
              <span className="spec-val">Dolby Atmos 64-Channel & IMAX 12-Track</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Projection Systems:</span>
              <span className="spec-val">Christie 4K RGB Pure Laser & 70mm Film Projectors</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Seat Collision Engine:</span>
              <span className="spec-val status-live">ACTIVE (0 Double Bookings)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CinemaAnalytics;
