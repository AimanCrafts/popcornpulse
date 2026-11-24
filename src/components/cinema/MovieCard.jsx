import React from 'react';
import { useCinema } from '../../context/CinemaContext';
import { TicketIcon, HeartIcon, SparklesIcon, PlayIcon, ClockIcon } from '../common/Icons';

const MovieCard = ({ movie }) => {
  const {
    setBookingMovie,
    setTrailerMovie,
    toggleWatchlist,
    isSavedInWatchlist,
    setActiveTab
  } = useCinema();

  const isSaved = isSavedInWatchlist(movie.id);

  return (
    <article className="cinematic-movie-card">
      <div className="card-poster-wrapper">
        <img 
          src={movie.poster} 
          alt={movie.title} 
          className="card-poster-img"
          loading="lazy"
        />

        {/* Pulse Score Badge */}
        <div className="card-pulse-badge" title="Community Pulse Score">
          <SparklesIcon size={14} className="text-gold" />
          <span className="pulse-val">{movie.pulseScore}%</span>
        </div>

        {/* Watchlist Quick Toggle */}
        <button 
          className={`card-watchlist-btn ${isSaved ? 'is-saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist(movie);
          }}
          title={isSaved ? "Remove from Watchlist" : "Save to Watchlist"}
          aria-label={isSaved ? "Remove from Watchlist" : "Save to Watchlist"}
        >
          <HeartIcon size={16} filled={isSaved} />
        </button>

        {/* Overlay on hover */}
        <div className="card-poster-overlay">
          <button 
            className="card-overlay-trailer-btn" 
            onClick={() => setTrailerMovie(movie)}
          >
            <PlayIcon size={16} />
            <span>Trailer</span>
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Genre Tags */}
        <div className="card-genres">
          {movie.genres.slice(0, 2).map((g) => (
            <span key={g} className="genre-tag">{g}</span>
          ))}
          <span className="runtime-tag">
            <ClockIcon size={12} /> {movie.runtime}
          </span>
        </div>

        <h3 className="card-title" title={movie.title}>{movie.title}</h3>
        <p className="card-director">Dir. {movie.director} • {movie.releaseYear}</p>

        {/* Formats Pills */}
        <div className="card-formats">
          {movie.formats.map((fmt) => (
            <span key={fmt} className="format-badge">{fmt}</span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="card-actions">
          <button className="card-book-btn" onClick={() => setBookingMovie(movie)}>
            <TicketIcon size={16} />
            <span>Showtimes</span>
          </button>
          <button 
            className="card-review-btn" 
            onClick={() => setActiveTab('reviews')} 
            title="Write a Pulse Review"
          >
            <span>Review</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
