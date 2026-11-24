import React, { useState } from 'react';
import { useCinema } from '../../context/CinemaContext';
import { SparklesIcon, ThumbsUpIcon, EyeOffIcon, PopcornIcon } from '../common/Icons';
import { api } from '../../services/api';

const AVAILABLE_TAGS = [
  'Must Watch in IMAX',
  'Mind-Bending',
  'Masterpiece',
  'Stunning Visuals',
  'Oscar Contender',
  'Instant Classic',
  'Soundtrack Gold'
];

const PulseReviews = () => {
  const { movies, reviews, handleReviewSubmitted, notify } = useCinema();

  const [selectedMovieId, setSelectedMovieId] = useState(movies[0]?.id || 'mov-1');
  const [filterMovieId, setFilterMovieId] = useState('ALL');
  const [revealedSpoilers, setRevealedSpoilers] = useState({});
  const [upvotedReviews, setUpvotedReviews] = useState({});

  // Review Form State
  const [reviewerName, setReviewerName] = useState('');
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [selectedTags, setSelectedTags] = useState(['Must Watch in IMAX']);
  const [ratings, setRatings] = useState({
    story: 5,
    visuals: 5,
    sound: 5,
    popcorn: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute live preview pulse score
  const livePulseScore = Math.round(
    ((ratings.story * 0.3) + (ratings.visuals * 0.25) + (ratings.sound * 0.2) + (ratings.popcorn * 0.25)) * 20
  );

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleStarChange = (dimension, val) => {
    setRatings(prev => ({ ...prev, [dimension]: val }));
  };

  const handleUpvote = async (revId) => {
    if (upvotedReviews[revId]) return;
    setUpvotedReviews({ ...upvotedReviews, [revId]: true });
    try {
      await api.upvoteReview(revId);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSpoilerReveal = (revId) => {
    setRevealedSpoilers(prev => ({ ...prev, [revId]: !prev[revId] }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!headline.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const targetMovie = movies.find(m => m.id === selectedMovieId);

    try {
      const payload = {
        movieId: selectedMovieId,
        movieTitle: targetMovie ? targetMovie.title : 'Cinema Film',
        userName: reviewerName.trim() || 'Verified Cinephile',
        ratings,
        headline,
        content,
        spoiler: isSpoiler,
        tags: selectedTags
      };

      const newRev = await api.submitReview(payload);
      handleReviewSubmitted(newRev);

      // Reset
      setHeadline('');
      setContent('');
      setIsSpoiler(false);
      setReviewerName('');
    } catch (err) {
      notify('Submission Notice', err.message || 'Error submitting review.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = filterMovieId === 'ALL'
    ? reviews
    : reviews.filter(r => r.movieId === filterMovieId);

  return (
    <section className="pulse-reviews-section">
      <div className="section-header-box">
        <div className="section-tagline">
          <SparklesIcon size={20} className="text-neon-gold" />
          <span>CINEMA SENTIMENT ENGINE</span>
        </div>
        <h2 className="section-main-heading">Community Pulse & Critical Consensus</h2>
        <p className="section-description">
          Multi-dimensional ratings curated by genuine moviegoers. Evaluate films across narrative depth, cinematography, sound design, and popcorn entertainment factor.
        </p>
      </div>

      <div className="reviews-layout-grid">
        {/* Left Column: Multi-Axis Review Form */}
        <div className="review-composer-card">
          <div className="composer-header">
            <h3>Publish Your Film Review</h3>
            <span className="live-pulse-badge">
              LIVE PULSE: <strong>{livePulseScore}%</strong>
            </span>
          </div>

          <form onSubmit={handleSubmitReview} className="composer-form">
            {/* Movie Picker */}
            <div className="form-group">
              <label>SELECT FILM:</label>
              <select
                value={selectedMovieId}
                onChange={(e) => setSelectedMovieId(e.target.value)}
                className="modal-form-select"
              >
                {movies.map(m => (
                  <option key={m.id} value={m.id}>{m.title} ({m.releaseYear})</option>
                ))}
              </select>
            </div>

            {/* 4-Axis Rating Stars */}
            <div className="rating-axes-box">
              <div className="axis-row">
                <span className="axis-title">Story & Screenplay</span>
                <div className="star-rating-picker">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`star-pick-btn ${ratings.story >= val ? 'filled' : ''}`}
                      onClick={() => handleStarChange('story', val)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="axis-row">
                <span className="axis-title">Visuals & Scale</span>
                <div className="star-rating-picker">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`star-pick-btn ${ratings.visuals >= val ? 'filled' : ''}`}
                      onClick={() => handleStarChange('visuals', val)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="axis-row">
                <span className="axis-title">Sound Design & Score</span>
                <div className="star-rating-picker">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`star-pick-btn ${ratings.sound >= val ? 'filled' : ''}`}
                      onClick={() => handleStarChange('sound', val)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="axis-row">
                <span className="axis-title">Popcorn Fun Factor</span>
                <div className="star-rating-picker">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`star-pick-btn ${ratings.popcorn >= val ? 'filled' : ''}`}
                      onClick={() => handleStarChange('popcorn', val)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviewer Name */}
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name or Cinephile Alias"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="modal-form-input"
              />
            </div>

            {/* Headline */}
            <div className="form-group">
              <input
                type="text"
                placeholder="Review Headline (e.g., A visceral masterpiece)"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="modal-form-input"
                required
              />
            </div>

            {/* Content */}
            <div className="form-group">
              <textarea
                placeholder="Share your detailed analysis, favorite moments, auditorium reactions..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="modal-form-textarea"
                rows="4"
                required
              />
            </div>

            {/* Tags Selector */}
            <div className="tags-selector-row">
              <span className="tags-label">TAGS:</span>
              <div className="tags-chips">
                {AVAILABLE_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-chip-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Spoiler Warning Checkbox */}
            <div className="spoiler-toggle-row">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={isSpoiler}
                  onChange={(e) => setIsSpoiler(e.target.checked)}
                />
                <span className="checkbox-text">Contains Plot Spoilers (Will be blurred)</span>
              </label>
            </div>

            <button type="submit" className="btn-submit-review" disabled={isSubmitting}>
              {isSubmitting ? 'Posting Review...' : 'Publish Pulse Review'}
            </button>
          </form>
        </div>

        {/* Right Column: Reviews Feed */}
        <div className="reviews-feed-column">
          {/* Feed Filter */}
          <div className="feed-filter-bar">
            <span>Filter by Film:</span>
            <select
              value={filterMovieId}
              onChange={(e) => setFilterMovieId(e.target.value)}
              className="feed-filter-select"
            >
              <option value="ALL">All Films ({reviews.length})</option>
              {movies.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          <div className="reviews-feed-list">
            {filteredReviews.length === 0 ? (
              <div className="empty-reviews-state">
                <PopcornIcon size={32} />
                <p>No reviews posted for this selection yet. Be the first critic!</p>
              </div>
            ) : (
              filteredReviews.map((rev) => {
                const isRevealed = revealedSpoilers[rev.id];
                const hasUpvoted = upvotedReviews[rev.id];

                return (
                  <article key={rev.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img src={rev.avatar} alt={rev.userName} className="reviewer-avatar" />
                        <div>
                          <div className="reviewer-name-row">
                            <span className="reviewer-name">{rev.userName}</span>
                            <span className="reviewer-badge">{rev.userBadge}</span>
                          </div>
                          <span className="review-date">{rev.date} • for <em>{rev.movieTitle}</em></span>
                        </div>
                      </div>

                      <div className="review-pulse-score">
                        <SparklesIcon size={14} className="text-neon-gold" />
                        <span>{rev.pulseScore}%</span>
                      </div>
                    </div>

                    <h4 className="review-headline">"{rev.headline}"</h4>

                    {/* Review content with spoiler protection */}
                    {rev.spoiler && !isRevealed ? (
                      <div className="spoiler-blur-box" onClick={() => toggleSpoilerReveal(rev.id)}>
                        <EyeOffIcon size={20} />
                        <span>Spoiler Warning • Click to Reveal</span>
                      </div>
                    ) : (
                      <p className="review-body">{rev.content}</p>
                    )}

                    {/* Ratings Grid breakdown */}
                    {rev.ratings && (
                      <div className="review-ratings-grid">
                        <span>Story: {rev.ratings.story}★</span>
                        <span>Visuals: {rev.ratings.visuals}★</span>
                        <span>Sound: {rev.ratings.sound}★</span>
                        <span>Popcorn: {rev.ratings.popcorn}★</span>
                      </div>
                    )}

                    {/* Tags */}
                    {rev.tags && (
                      <div className="review-tags-list">
                        {rev.tags.map((t, idx) => (
                          <span key={idx} className="review-tag-badge">#{t}</span>
                        ))}
                      </div>
                    )}

                    {/* Footer with Upvote */}
                    <div className="review-footer">
                      <button
                        className={`btn-upvote-review ${hasUpvoted ? 'upvoted' : ''}`}
                        onClick={() => handleUpvote(rev.id)}
                      >
                        <ThumbsUpIcon size={14} />
                        <span>Helpful ({rev.helpfulCount + (hasUpvoted ? 1 : 0)})</span>
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PulseReviews;
