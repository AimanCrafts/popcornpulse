// src/components/booking/BookingModal.jsx
import React, { useState } from 'react';
import { useCinema } from '../../context/CinemaContext';
import {
  XIcon,
  ArmchairIcon,
  CheckIcon
} from '../common/Icons';
import { api } from '../../services/api';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SEATS_PER_ROW = 8;

const BookingModal = () => {
  const {
    bookingMovie,
    setBookingMovie,
    showtimes,
    concessions,
    handleBookingSuccess
  } = useCinema();

  if (!bookingMovie) return null;

  const movieShowtimes = showtimes.filter(s => s.movieId === bookingMovie.id);
  const initialShowtime = movieShowtimes[0] || showtimes[0] || {
    id: 'st-101',
    cinema: 'PopcornPulse Grand Cinema - Downtown',
    screen: 'IMAX Laser 70mm Screen 1',
    format: 'IMAX 70mm',
    time: '14:30',
    date: 'Today',
    price: 18.50,
    vipPrice: 24.00,
    occupiedSeats: ['A3', 'A4', 'B5', 'B6', 'C4', 'C5']
  };

  const [selectedShowtimeId, setSelectedShowtimeId] = useState(initialShowtime.id);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketType, setTicketType] = useState('Standard');
  const [selectedConcessions, setSelectedConcessions] = useState([]);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const activeShowtime = showtimes.find(s => s.id === selectedShowtimeId) || initialShowtime;
  const unitPrice = ticketType === 'VIP Recliner' ? activeShowtime.vipPrice : activeShowtime.price;
  const ticketsSubtotal = selectedSeats.length * unitPrice;
  const concessionsSubtotal = selectedConcessions.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const grandTotal = Number((ticketsSubtotal + concessionsSubtotal).toFixed(2));

  const handleClose = () => setBookingMovie(null);

  // Toggle seat selection
  const handleSeatClick = (seatCode, isOccupied) => {
    if (isOccupied) return;
    setErrorMsg('');
    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatCode));
    } else {
      if (selectedSeats.length >= 6) {
        setErrorMsg('Maximum 6 seats per transaction.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatCode]);
    }
  };

  // Concession quantity changer
  const updateConcessionQty = (item, delta) => {
    const existing = selectedConcessions.find(c => c.id === item.id);
    if (!existing && delta > 0) {
      setSelectedConcessions([...selectedConcessions, { ...item, qty: 1 }]);
    } else if (existing) {
      const newQty = existing.qty + delta;
      if (newQty <= 0) {
        setSelectedConcessions(selectedConcessions.filter(c => c.id !== item.id));
      } else {
        setSelectedConcessions(selectedConcessions.map(c => c.id === item.id ? { ...c, qty: newQty } : c));
      }
    }
  };

  // Submit Reservation
  const handleConfirmReservation = async (e) => {
    e.preventDefault();
    if (!selectedSeats.length) {
      setErrorMsg('Please select at least one seat from the auditorium chart.');
      return;
    }
    if (!guestEmail.trim()) {
      setErrorMsg('Please enter your email to receive your digital cinema boarding pass.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        showtimeId: activeShowtime.id,
        movieId: bookingMovie.id,
        movieTitle: bookingMovie.title,
        customer: {
          name: guestName.trim() || 'Valued Guest',
          email: guestEmail.trim(),
          phone: guestPhone.trim() || 'N/A'
        },
        seats: selectedSeats,
        ticketType,
        concessions: selectedConcessions,
        totalAmount: grandTotal
      };

      const bookingResult = await api.createBooking(payload);
      setConfirmedBooking(bookingResult);
      handleBookingSuccess(bookingResult);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="booking-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <span className="modal-subtitle">RESERVE AUDITORIUM SEATS</span>
            <h2 className="modal-movie-title">{bookingMovie.title}</h2>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <XIcon size={20} />
          </button>
        </div>

        {confirmedBooking ? (
          /* ==========================================
             DIGITAL CINEMA BOARDING PASS CONFIRMATION
             ========================================== */
          <div className="ticket-pass-confirmation">
            <div className="confirmation-badge">
              <CheckIcon size={24} className="text-neon-gold" />
              <span>DIGITAL CINEMA BOARDING PASS ISSUED</span>
            </div>

            <div className="digital-ticket-card">
              <div className="ticket-cutout-top" />
              <div className="ticket-header">
                <div className="ticket-brand">🍿 PopcornPulse Cinema</div>
                <div className="ticket-code-badge">{confirmedBooking.bookingCode}</div>
              </div>

              <div className="ticket-movie-details">
                <h3>{confirmedBooking.movieTitle}</h3>
                <p className="ticket-screen-type">{confirmedBooking.format} • {confirmedBooking.screen}</p>
              </div>

              <div className="ticket-grid-info">
                <div className="info-block">
                  <span className="info-label">DATE</span>
                  <span className="info-val">{confirmedBooking.date}</span>
                </div>
                <div className="info-block">
                  <span className="info-label">TIME</span>
                  <span className="info-val">{confirmedBooking.time}</span>
                </div>
                <div className="info-block">
                  <span className="info-label">SEATS</span>
                  <span className="info-val highlight">{confirmedBooking.seats.join(', ')}</span>
                </div>
                <div className="info-block">
                  <span className="info-label">TIER</span>
                  <span className="info-val">{confirmedBooking.ticketType}</span>
                </div>
              </div>

              {confirmedBooking.concessions && confirmedBooking.concessions.length > 0 && (
                <div className="ticket-concessions-preview">
                  <span className="info-label">CONCESSIONS INCLUDED</span>
                  <div className="concessions-pills">
                    {confirmedBooking.concessions.map((c, i) => (
                      <span key={i} className="concession-pill">
                        🍿 {c.name} (x{c.qty})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="ticket-perforation">
                <span className="perforation-dash" />
              </div>

              <div className="ticket-footer">
                <div className="ticket-barcode-box">
                  <div className="simulated-barcode">
                    {[...Array(38)].map((_, idx) => (
                      <div 
                        key={idx} 
                        className="barcode-stripe" 
                        style={{ width: idx % 3 === 0 ? '4px' : '2px', opacity: idx % 5 === 0 ? 0.4 : 1 }} 
                      />
                    ))}
                  </div>
                  <span className="barcode-number">REF #{confirmedBooking.id} • SCAN AT AUDITORIUM DOOR</span>
                </div>
                <div className="ticket-price-total">
                  <span>TOTAL PAID</span>
                  <strong>${confirmedBooking.totalAmount.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div className="ticket-modal-actions">
              <button className="btn-print-ticket" onClick={() => window.print()}>
                Print / Save Pass
              </button>
              <button className="btn-done-ticket" onClick={handleClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ==========================================
             SEAT SELECTOR & BOOKING CONFIGURATOR
             ========================================== */
          <div className="modal-booking-grid">
            {/* Left Column: Screen & Seat Matrix */}
            <div className="booking-seating-section">
              {/* Showtime Selector */}
              <div className="showtime-format-chips">
                <label className="section-small-label">SELECT SHOWTIME & SCREEN:</label>
                <div className="chips-container">
                  {(movieShowtimes.length ? movieShowtimes : [initialShowtime]).map((st) => (
                    <button
                      key={st.id}
                      className={`showtime-chip ${st.id === activeShowtime.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedShowtimeId(st.id);
                        setSelectedSeats([]);
                      }}
                    >
                      <span className="chip-format">{st.format}</span>
                      <span className="chip-time">{st.time} ({st.date})</span>
                      <span className="chip-price">${st.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Curved Cinema Screen */}
              <div className="cinema-screen-container">
                <div className="curved-screen-graphic">
                  <div className="screen-glow" />
                  <span className="screen-text">ALL EYES ON SCREEN (IMAX 70mm DUAL LASER)</span>
                </div>
              </div>

              {/* Seating Grid */}
              <div className="seating-chart">
                {ROWS.map((row) => (
                  <div key={row} className="seat-row">
                    <span className="row-letter">{row}</span>
                    <div className="row-seats">
                      {[...Array(SEATS_PER_ROW)].map((_, idx) => {
                        const seatNum = idx + 1;
                        const seatCode = `${row}${seatNum}`;
                        const isOccupied = (activeShowtime.occupiedSeats || []).includes(seatCode);
                        const isSelected = selectedSeats.includes(seatCode);
                        const isVipRow = row === 'C' || row === 'D';

                        return (
                          <button
                            key={seatCode}
                            type="button"
                            className={`cinema-seat ${isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''} ${isVipRow ? 'vip-seat' : ''}`}
                            onClick={() => handleSeatClick(seatCode, isOccupied)}
                            disabled={isOccupied}
                            title={`${seatCode} ${isVipRow ? '(VIP Recliner)' : ''} ${isOccupied ? '- Occupied' : '- Available'}`}
                            aria-label={`Seat ${seatCode}`}
                          >
                            <ArmchairIcon size={14} />
                            <span className="seat-label">{seatNum}</span>
                          </button>
                        );
                      })}
                    </div>
                    <span className="row-letter">{row}</span>
                  </div>
                ))}
              </div>

              {/* Seating Legend */}
              <div className="seating-legend">
                <div className="legend-item">
                  <span className="legend-sample available" />
                  <span>Available</span>
                </div>
                <div className="legend-item">
                  <span className="legend-sample selected" />
                  <span>Selected</span>
                </div>
                <div className="legend-item">
                  <span className="legend-sample vip" />
                  <span>VIP Recliner</span>
                </div>
                <div className="legend-item">
                  <span className="legend-sample occupied" />
                  <span>Reserved</span>
                </div>
              </div>
            </div>

            {/* Right Column: Ticket Tier, Concessions & Summary */}
            <div className="booking-summary-section">
              <div className="ticket-tier-selector">
                <label className="section-small-label">TICKET SEATING TIER:</label>
                <div className="tier-options">
                  <button
                    type="button"
                    className={`tier-btn ${ticketType === 'Standard' ? 'active' : ''}`}
                    onClick={() => setTicketType('Standard')}
                  >
                    <span className="tier-name">Standard</span>
                    <span className="tier-cost">${activeShowtime.price.toFixed(2)}</span>
                  </button>
                  <button
                    type="button"
                    className={`tier-btn ${ticketType === 'VIP Recliner' ? 'active' : ''}`}
                    onClick={() => setTicketType('VIP Recliner')}
                  >
                    <span className="tier-name">VIP Recliner ⭐</span>
                    <span className="tier-cost">${activeShowtime.vipPrice.toFixed(2)}</span>
                  </button>
                </div>
              </div>

              {/* Snack Concession Add-on */}
              <div className="modal-concessions-addon">
                <label className="section-small-label">ADD POPCORN & REFRESHMENTS:</label>
                <div className="addon-items-list">
                  {concessions.slice(0, 3).map((snack) => {
                    const sel = selectedConcessions.find(c => c.id === snack.id);
                    const qty = sel ? sel.qty : 0;

                    return (
                      <div key={snack.id} className="addon-item-row">
                        <div className="addon-info">
                          <span className="addon-title">{snack.name}</span>
                          <span className="addon-price">+${snack.price.toFixed(2)}</span>
                        </div>
                        <div className="addon-stepper">
                          <button 
                            type="button" 
                            className="step-btn" 
                            onClick={() => updateConcessionQty(snack, -1)}
                            disabled={qty === 0}
                            aria-label={`Decrease ${snack.name}`}
                          >
                            -
                          </button>
                          <span className="step-count">{qty}</span>
                          <button 
                            type="button" 
                            className="step-btn" 
                            onClick={() => updateConcessionQty(snack, 1)}
                            aria-label={`Increase ${snack.name}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Guest Details Form */}
              <form onSubmit={handleConfirmReservation} className="booking-form">
                <label className="section-small-label">PASS RECIPIENT INFORMATION:</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="modal-form-input"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address (for digital ticket delivery)"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="modal-form-input"
                  required
                />
                <input
                  type="tel"
                  placeholder="Mobile Phone (SMS auditorium reminder)"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="modal-form-input"
                />

                {/* Subtotal Calculation */}
                <div className="booking-cost-breakdown">
                  <div className="cost-row">
                    <span>Seats ({selectedSeats.length || 0}):</span>
                    <span>${ticketsSubtotal.toFixed(2)}</span>
                  </div>
                  {concessionsSubtotal > 0 && (
                    <div className="cost-row">
                      <span>Concessions:</span>
                      <span>${concessionsSubtotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="cost-row total-row">
                    <span>Total Amount:</span>
                    <span className="total-gold">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {errorMsg && <p className="modal-error-message">{errorMsg}</p>}

                <button 
                  type="submit" 
                  className="modal-confirm-btn" 
                  disabled={isSubmitting || selectedSeats.length === 0}
                >
                  {isSubmitting ? 'Securing Seats...' : `Confirm & Issue Pass ($${grandTotal.toFixed(2)})`}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
