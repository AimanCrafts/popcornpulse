import React from 'react';
import { useCinema } from '../../context/CinemaContext';

const ShowtimesList = () => {
  const { movies, showtimes, openBookingModal } = useCinema();

  return (
    <section className="showtimes-view-wrapper">
      <div className="section-header-box">
        <span className="section-tagline">INSTANT SEAT RESERVATION</span>
        <h2 className="section-main-heading">Cinema Showtimes & Auditoriums</h2>
        <p className="section-description">
          Browse laser projection formats, Dolby Atmos sound stages, and reserve your favorite reclining seats.
        </p>
      </div>

      <div className="showtimes-film-groups">
        {movies.map((m) => {
          const filmShowtimes = showtimes.filter((s) => s.movieId === m.id);
          if (!filmShowtimes.length) return null;

          return (
            <div key={m.id} className="film-showtimes-strip">
              <div className="strip-movie-card">
                <img src={m.poster} alt={m.title} />
                <div>
                  <h3>{m.title}</h3>
                  <p>{m.ageRating} • {m.runtime} • {m.genres.join(', ')}</p>
                </div>
              </div>

              <div className="strip-times-grid">
                {filmShowtimes.map((st) => (
                  <button
                    key={st.id}
                    className="showtime-card-btn"
                    onClick={() => openBookingModal(m, st)}
                  >
                    <span className="format-tag">{st.format}</span>
                    <span className="time-val">{st.time}</span>
                    <span className="screen-val">{st.screen}</span>
                    <span className="price-tag">From ${st.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ShowtimesList;
