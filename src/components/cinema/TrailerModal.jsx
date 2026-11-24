import React from 'react';
import { useCinema } from '../../context/CinemaContext';
import { XIcon, TicketIcon } from '../common/Icons';

const TrailerModal = () => {
  const { trailerMovie, setTrailerMovie, setBookingMovie } = useCinema();

  if (!trailerMovie) return null;

  // Convert youtube watch URL to embed URL if needed
  let embedUrl = trailerMovie.trailerUrl || 'https://www.youtube.com/embed/Way9Dexny3w';
  if (embedUrl.includes('watch?v=')) {
    embedUrl = embedUrl.replace('watch?v=', 'embed/');
  }

  const handleClose = () => setTrailerMovie(null);

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="trailer-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="trailer-header">
          <div className="trailer-title-info">
            <span className="trailer-tag">OFFICIAL 4K TRAILER</span>
            <h3>{trailerMovie.title}</h3>
          </div>
          <button className="trailer-close-btn" onClick={handleClose} aria-label="Close Trailer">
            <XIcon size={20} />
          </button>
        </div>

        <div className="trailer-video-frame">
          <iframe
            src={`${embedUrl}?autoplay=1&rel=0`}
            title={`${trailerMovie.title} Trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="trailer-footer">
          <p className="trailer-synopsis">{trailerMovie.synopsis}</p>
          <button 
            className="trailer-book-btn" 
            onClick={() => {
              handleClose();
              setBookingMovie(trailerMovie);
            }}
          >
            <TicketIcon size={18} />
            <span>Select Seats for {trailerMovie.title}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
