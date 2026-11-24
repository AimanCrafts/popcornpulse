import React from 'react';
import { useCinema } from '../../context/CinemaContext';

const GENRES = [
  'All',
  'Sci-Fi',
  'Action',
  'Drama',
  'Animation',
  'Comedy',
  'Romance',
  'Thriller',
  'Horror',
  'Adventure',
  'Mystery'
];

const MovieFilterBar = () => {
  const {
    statusFilter,
    setStatusFilter,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy
  } = useCinema();

  return (
    <div className="catalog-toolbar">
      <div className="status-toggle-group">
        <button
          className={`status-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All Titles
        </button>
        <button
          className={`status-btn ${statusFilter === 'now_playing' ? 'active' : ''}`}
          onClick={() => setStatusFilter('now_playing')}
        >
          Now Screening
        </button>
        <button
          className={`status-btn ${statusFilter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setStatusFilter('upcoming')}
        >
          Coming Soon
        </button>
        <button
          className={`status-btn ${statusFilter === 'trending' ? 'active' : ''}`}
          onClick={() => setStatusFilter('trending')}
        >
          Trending
        </button>
      </div>

      <div className="genre-chips-scroll">
        {GENRES.map((genre) => (
          <button
            key={genre}
            className={`genre-chip ${selectedGenre === genre ? 'active' : ''}`}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="sort-dropdown-box">
        <label htmlFor="movie-sort-select">Sort:</label>
        <select
          id="movie-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="pulse">Highest Pulse Score</option>
          <option value="newest">Release Year</option>
          <option value="title">Alphabetical (A-Z)</option>
        </select>
      </div>
    </div>
  );
};

export default MovieFilterBar;
