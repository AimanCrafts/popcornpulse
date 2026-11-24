import React from 'react';
import { useCinema } from '../../context/CinemaContext';
import {
  PlayIcon,
  TicketIcon,
  StarIcon,
  FlameIcon,
  SparklesIcon,
  ClockIcon,
  PopcornIcon
} from '../common/Icons';

const HeroBanner = ({ movie }) => {
  const { setBookingMovie, setTrailerMovie } = useCinema();

  if (!movie) return null;

  return (
    <section className="cinematic-hero">
      {/* Background with cinematic vignette gradient */}
      <div 
        className="hero-backdrop" 
        style={{ backgroundImage: `url(${movie.backdrop || movie.poster})` }}
      >
        <div className="hero-gradient-overlay" />
      </div>

      <div className="hero-content-wrapper">
        <div className="hero-badge-row">
          <span className="hero-pill-hot">
            <FlameIcon size={14} /> NOW SCREENING IN IMAX 70mm
          </span>
          <span className="hero-pill-rating">{movie.ageRating}</span>
          <span className="hero-pill-runtime">
            <ClockIcon size={14} /> {movie.runtime}
          </span>
        </div>

        <h1 className="hero-title">{movie.title}</h1>
        <p className="hero-tagline">"{movie.tagline}"</p>

        {/* Pulse Rating Box */}
        <div className="hero-pulse-metrics">
          <div className="pulse-metric-card">
            <div className="metric-score">
              <span className="score-number">{movie.pulseScore}%</span>
              <SparklesIcon size={16} className="text-gold" />
            </div>
            <span className="metric-label">COMMUNITY PULSE</span>
          </div>

          <div className="pulse-metric-card">
            <div className="metric-score">
              <span className="score-number">{movie.criticScore}%</span>
              <StarIcon size={16} filled className="text-gold" />
            </div>
            <span className="metric-label">CRITIC CONSENSUS</span>
          </div>

          <div className="pulse-metric-card">
            <div className="metric-score">
              <span className="score-number">{movie.audienceScore}%</span>
              <PopcornIcon size={16} className="text-gold" />
            </div>
            <span className="metric-label">POPCORN SCORE</span>
          </div>
        </div>

        <p className="hero-synopsis">{movie.synopsis}</p>

        {/* Cast & Director Preview */}
        <div className="hero-credits">
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Starring:</strong> {movie.cast.slice(0, 3).join(', ')}</p>
        </div>

        {/* Action Buttons */}
        <div className="hero-actions">
          <button className="btn-hero-primary" onClick={() => setBookingMovie(movie)}>
            <TicketIcon size={20} />
            <span>Select Seats & Book</span>
          </button>
          
          <button className="btn-hero-secondary" onClick={() => setTrailerMovie(movie)}>
            <PlayIcon size={18} />
            <span>Watch 4K Trailer</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
