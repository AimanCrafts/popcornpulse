// src/context/CinemaContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const CinemaContext = createContext(null);

export const CinemaProvider = ({ children }) => {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState('movies');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('pulse');

  // Domain data states
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [concessions, setConcessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cinema lighting mood state
  const [cinemaLightsDimmed, setCinemaLightsDimmed] = useState(false);

  // Watchlist persisted state
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('popcornpulse_watchlist')) || [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [bookingMovie, setBookingMovie] = useState(null);
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Notification helper
  const notify = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Sync watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('popcornpulse_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.warn('Could not persist watchlist:', e);
    }
  }, [watchlist]);

  // Load all platform data
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [movs, sts, snks, evts, revs, st] = await Promise.all([
        api.getMovies(),
        api.getShowtimes(),
        api.getConcessions(),
        api.getEvents(),
        api.getReviews(),
        api.getStats()
      ]);
      setMovies(movs);
      setShowtimes(sts);
      setConcessions(snks);
      setEvents(evts);
      setReviews(revs);
      setStats(st);
    } catch (err) {
      console.error('Error loading cinema data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Filtered & Sorted movies
  const filteredMovies = movies
    .filter((m) => {
      const matchSearch =
        !searchQuery ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.cast.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchGenre =
        selectedGenre === 'All' ||
        m.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());

      const matchStatus =
        statusFilter === 'all' || m.status === statusFilter;

      return matchSearch && matchGenre && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'pulse') return b.pulseScore - a.pulseScore;
      if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  // Watchlist Actions
  const toggleWatchlist = (movie) => {
    const exists = watchlist.some((m) => m.id === movie.id);
    if (exists) {
      setWatchlist(watchlist.filter((m) => m.id !== movie.id));
      notify('Removed from Watchlist', `"${movie.title}" removed.`);
    } else {
      setWatchlist([...watchlist, movie]);
      notify('Added to Watchlist', `"${movie.title}" saved to your cinema list.`, 'info');
    }
  };

  const isSavedInWatchlist = (movieId) => {
    return watchlist.some((m) => m.id === movieId);
  };

  // Booking Actions
  const handleBookingSuccess = (booking) => {
    notify(
      'Reservation Confirmed!',
      `Pass #${booking.bookingCode} for "${booking.movieTitle}" issued successfully.`
    );
    api.getStats().then(setStats).catch(() => {});
  };

  // RSVP Actions
  const handleRsvpSuccess = (event, guestName) => {
    notify('Watch Party RSVP Confirmed!', `See you at "${event.title}"!`, 'info');
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, rsvps: e.rsvps + 1 } : e))
    );
  };

  // Review Actions
  const handleReviewSubmitted = (newRev) => {
    setReviews((prev) => [newRev, ...prev]);
    notify(
      'Pulse Review Published!',
      `Thank you for contributing your ${newRev.pulseScore}% rating for "${newRev.movieTitle}".`
    );
  };

  const value = {
    // Nav & Filters
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,

    // Data
    movies,
    filteredMovies,
    showtimes,
    concessions,
    events,
    reviews,
    stats,
    isLoading,
    refreshData: loadAllData,

    // Watchlist
    watchlist,
    toggleWatchlist,
    isSavedInWatchlist,
    isWatchlistOpen,
    setIsWatchlistOpen,

    // Modals
    bookingMovie,
    setBookingMovie,
    trailerMovie,
    setTrailerMovie,

    // Ambience
    cinemaLightsDimmed,
    toggleCinemaLights: () => setCinemaLightsDimmed((prev) => !prev),

    // Notifications
    toast,
    setToast,
    notify,

    // Action Handlers
    handleBookingSuccess,
    handleRsvpSuccess,
    handleReviewSubmitted
  };

  return <CinemaContext.Provider value={value}>{children}</CinemaContext.Provider>;
};

export const useCinema = () => {
  const context = useContext(CinemaContext);
  if (!context) {
    throw new Error('useCinema must be used within a CinemaProvider');
  }
  return context;
};
