import React from 'react';
import { useCinema } from '../../context/CinemaContext';
import { XIcon, TicketIcon, ClockIcon, SparklesIcon } from '../common/Icons';

const WatchlistDrawer = () => {
  const {
    isWatchlistOpen,
    setIsWatchlistOpen,
    watchlist,
    toggleWatchlist,
    setBookingMovie
  } = useCinema();

  if (!isWatchlistOpen) return null;

  const handleClose = () => setIsWatchlistOpen(false);

  return (
    <div className="drawer-backdrop" onClick={handleClose}>
      <div className="watchlist-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-row">
            <h2>Your Cinema Watchlist</h2>
            <span className="drawer-counter">{watchlist.length}</span>
          </div>
          <button className="drawer-close-btn" onClick={handleClose} aria-label="Close watchlist drawer">
            <XIcon size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {watchlist.length === 0 ? (
            <div className="drawer-empty-state">
              <span className="empty-emoji">🎬</span>
              <h3>Your watchlist is empty</h3>
              <p>Click the heart icon on any film card to save it for your next cinema outing.</p>
            </div>
          ) : (
            <div className="drawer-movies-list">
              {watchlist.map((movie) => (
                <div key={movie.id} className="drawer-movie-item">
                  <img src={movie.poster} alt={movie.title} className="drawer-movie-img" />
                  <div className="drawer-movie-details">
                    <div className="drawer-movie-title-row">
                      <h4>{movie.title}</h4>
                      <button 
                        className="drawer-remove-btn" 
                        onClick={() => toggleWatchlist(movie)}
                        title="Remove from list"
                        aria-label={`Remove ${movie.title} from watchlist`}
                      >
                        ×
                      </button>
                    </div>
                    <div className="drawer-movie-meta">
                      <span>{movie.genres[0]}</span>
                      <span>•</span>
                      <span><ClockIcon size={12} /> {movie.runtime}</span>
                    </div>
                    <div className="drawer-pulse-score">
                      <SparklesIcon size={12} className="text-neon-gold" />
                      <span>{movie.pulseScore}% Pulse</span>
                    </div>

                    <button 
                      className="drawer-book-btn" 
                      onClick={() => {
                        handleClose();
                        setBookingMovie(movie);
                      }}
                    >
                      <TicketIcon size={14} />
                      <span>Book Seats</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchlistDrawer;
