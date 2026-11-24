import React, { useState } from 'react';
import { useCinema } from '../../context/CinemaContext';
import { UsersIcon, CalendarIcon, MapPinIcon, CheckIcon } from '../common/Icons';
import { api } from '../../services/api';

const CommunityEvents = () => {
  const { events, handleRsvpSuccess, notify } = useCinema();
  const [rsvpState, setRsvpState] = useState({});
  const [guestName, setGuestName] = useState('');
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  const handleOpenRsvp = (event) => {
    setActiveModalEvent(event);
  };

  const handleConfirmRsvp = async (e) => {
    e.preventDefault();
    if (!activeModalEvent) return;

    try {
      await api.rsvpEvent(activeModalEvent.id, guestName);
      setRsvpState({ ...rsvpState, [activeModalEvent.id]: true });
      handleRsvpSuccess(activeModalEvent, guestName || 'Cinephile');
      setActiveModalEvent(null);
      setGuestName('');
    } catch (err) {
      notify('RSVP Notice', err.message || 'Could not RSVP.', 'error');
    }
  };

  return (
    <section className="community-events-section">
      <div className="section-header-box">
        <div className="section-tagline">
          <UsersIcon size={20} className="text-neon-cyan" />
          <span>COMMUNITY CINEPHILE GATHERINGS</span>
        </div>
        <h2 className="section-main-heading">Movie Nights & Watch Parties</h2>
        <p className="section-description">
          Experience films the way they were meant to be seen: shared with an enthusiastic crowd. Q&As, director retrospectives, and 70mm community marathons.
        </p>
      </div>

      <div className="events-grid">
        {events.map((evt) => {
          const isRsvpd = rsvpState[evt.id];
          const capacityPercent = Math.min(100, Math.round((evt.rsvps / evt.maxCapacity) * 100));

          return (
            <article key={evt.id} className="event-card">
              <div 
                className="event-banner"
                style={{ backgroundImage: `url(${evt.banner})` }}
              >
                <div className="event-banner-overlay" />
                <span className="event-badge">{evt.badge}</span>
                <span className="event-movie-pill">🎬 {evt.movie}</span>
              </div>

              <div className="event-card-body">
                <div className="event-date-row">
                  <span className="event-date-tag">
                    <CalendarIcon size={14} /> {evt.date}
                  </span>
                  <span className="event-venue-tag">
                    <MapPinIcon size={14} /> {evt.venue}
                  </span>
                </div>

                <h3 className="event-title">{evt.title}</h3>
                <p className="event-desc">{evt.description}</p>
                <p className="event-host"><strong>Hosted by:</strong> {evt.host}</p>

                {/* Capacity Progress Bar */}
                <div className="event-capacity-tracker">
                  <div className="capacity-label-row">
                    <span>{evt.rsvps} Cinephiles Attending</span>
                    <span>{evt.maxCapacity - evt.rsvps} Seats Left</span>
                  </div>
                  <div className="capacity-bar-track">
                    <div 
                      className="capacity-bar-fill" 
                      style={{ width: `${capacityPercent}%` }} 
                    />
                  </div>
                </div>

                <div className="event-card-footer">
                  {isRsvpd ? (
                    <button className="btn-rsvpd" disabled>
                      <CheckIcon size={16} />
                      <span>RSVP Confirmed (See You There!)</span>
                    </button>
                  ) : (
                    <button className="btn-rsvp" onClick={() => handleOpenRsvp(evt)}>
                      <span>Join Watch Party</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* RSVP Dialog Modal */}
      {activeModalEvent && (
        <div className="modal-backdrop" onClick={() => setActiveModalEvent(null)}>
          <div className="rsvp-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm RSVP for Watch Party</h3>
            <p className="rsvp-modal-subtitle">{activeModalEvent.title}</p>
            <p className="rsvp-modal-details">
              📅 {activeModalEvent.date} • 📍 {activeModalEvent.venue}
            </p>

            <form onSubmit={handleConfirmRsvp} className="rsvp-form">
              <input
                type="text"
                placeholder="Your Name (Cinephile Badge)"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="modal-form-input"
                required
              />
              <div className="rsvp-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setActiveModalEvent(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-confirm-rsvp">
                  Confirm Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default CommunityEvents;
