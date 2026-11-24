// src/App.jsx
import React from 'react';
import { CinemaProvider, useCinema } from './context/CinemaContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroBanner from './components/cinema/HeroBanner';
import MovieCard from './components/cinema/MovieCard';
import MovieFilterBar from './components/cinema/MovieFilterBar';
import TrailerModal from './components/cinema/TrailerModal';
import BookingModal from './components/booking/BookingModal';
import ShowtimesList from './components/booking/ShowtimesList';
import ConcessionsMenu from './components/concessions/ConcessionsMenu';
import CommunityEvents from './components/community/CommunityEvents';
import PulseReviews from './components/community/PulseReviews';
import CinemaAnalytics from './components/analytics/CinemaAnalytics';
import WatchlistDrawer from './components/watchlist/WatchlistDrawer';
import Toast from './components/common/Toast';
import './App.css';

const CinemaAppContent = () => {
  const {
    activeTab,
    movies,
    filteredMovies,
    toast,
    setToast,
    cinemaLightsDimmed,
    setSearchQuery,
    setSelectedGenre,
    setStatusFilter
  } = useCinema();

  const heroMovie = movies.find((m) => m.id === 'mov-1') || movies[0];

  return (
    <div className={`popcornpulse-app ${cinemaLightsDimmed ? 'cinema-ambience-active' : ''}`}>
      {/* Toast Alert */}
      <Toast notification={toast} onClose={() => setToast(null)} />

      {/* Main Top Navigation */}
      <Navbar />

      <main className="main-content-flow">
        {/* TAB 1: MOVIES CATALOG & SHOWCASE */}
        {activeTab === 'movies' && (
          <>
            <HeroBanner movie={heroMovie} />

            <section className="catalog-section">
              <MovieFilterBar />

              {/* Movies Grid */}
              <div className="movies-grid">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              {filteredMovies.length === 0 && (
                <div className="no-movies-found">
                  <span className="no-movies-emoji">🍿</span>
                  <h3>No screenings matching your query</h3>
                  <p>Try clearing your search term or switching genre filters.</p>
                  <button
                    className="btn-reset-filters"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedGenre('All');
                      setStatusFilter('all');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {/* TAB 2: AUDITORIUM SHOWTIMES */}
        {activeTab === 'showtimes' && <ShowtimesList />}

        {/* TAB 3: CONCESSIONS BAR */}
        {activeTab === 'concessions' && <ConcessionsMenu />}

        {/* TAB 4: COMMUNITY GATHERINGS */}
        {activeTab === 'events' && <CommunityEvents />}

        {/* TAB 5: PULSE REVIEWS */}
        {activeTab === 'reviews' && <PulseReviews />}

        {/* TAB 6: CINEMA ANALYTICS */}
        {activeTab === 'analytics' && <CinemaAnalytics />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <BookingModal />
      <TrailerModal />
      <WatchlistDrawer />
    </div>
  );
};

const App = () => {
  return (
    <CinemaProvider>
      <CinemaAppContent />
    </CinemaProvider>
  );
};

export default App;
