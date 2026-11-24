# 🍿 PopcornPulse — Modern Full-Stack Cinema & Movie Platform

[![Deploy to GitHub Pages](https://github.com/AimanCrafts/popcornpulse/actions/workflows/deploy.yml/badge.svg)](https://github.com/AimanCrafts/popcornpulse/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-ffd700?style=flat&logo=github)](https://aimancrafts.github.io/popcornpulse/)
[![React 19](https://img.shields.io/badge/React-19.2-61dafb?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646cff?style=flat&logo=vite)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat&logo=express)](https://expressjs.com/)

> **Live Demo:** [https://aimancrafts.github.io/popcornpulse/](https://aimancrafts.github.io/popcornpulse/)

PopcornPulse is a production-grade cinema experience and movie discovery platform engineered with high-performance modern web standards, modular software design patterns, and an immersive cyber-cinema aesthetic.

---

## 🌟 Senior Software Engineering Architecture

Instead of simple, flat CRUD tables, PopcornPulse implements versatile cinema domain patterns:

1. **Dynamic Media Discovery & Screen Filtering Engine**:
   - Multi-dimensional query filters: Status (`now_playing`, `upcoming`, `trending`), Genres (`Sci-Fi`, `Action`, `Drama`, `Animation`, `Mystery`), and Sort options (`Highest Pulse Score`, `Release Year`, `Alphabetical`).
   - Deep search across film title, director, cast members, and screen formats.

2. **Interactive Cinema Seating Matrix & Collision-Protected Booking Engine**:
   - Curved screen geometry (`ALL EYES ON SCREEN` IMAX 70mm perspective).
   - Real-time seat statuses: Available, Selected, Reserved/Occupied, VIP Recliner.
   - Seat collision validation prevents concurrent double-booking.
   - Digital Cinema Boarding Pass generation with reference IDs, barcode representation, auditorium info, seat allocations, and print/save capabilities.

3. **Multi-Axis "Pulse" Sentiment & Criticism Hub**:
   - Rather than flat feedback strings, users evaluate films across four core cinema dimensions:
     - 📖 Story & Screenplay (1–5 ★)
     - 🎨 Visuals & IMAX Scale (1–5 ★)
     - 🎵 Sound Design & Score (1–5 ★)
     - 🍿 Popcorn Fun Factor (1–5 ★)
   - Algorithmic composite weighted Pulse Score (0–100%).
   - Spoiler protection: Blur overlay with click-to-reveal toggle.
   - Cinephile verification badges and community upvote system.

4. **Community Movie Nights & Watch Parties**:
   - Cinephile gatherings with venue details, host credits, live capacity tracking, and one-click RSVP confirmation.

5. **Gourmet Cinema Concessions Bar**:
   - Pre-order gourmet truffle butter popcorn tubs, blue raspberry frost ICEEs, and Cinephile combo packs directly with your ticket pass.

6. **Real-Time Cinema Pulse Analytics Dashboard**:
   - KPI metrics: Total tickets issued, community sentiment rating, active auditoriums, genre distribution charts, and projection format breakdown.

7. **Watchlist & Personal Drawer**:
   - LocalStorage-persisted personal cinema watchlist with instant booking shortcuts.

8. **Auditorium Ambience Mode ("Dim Lights")**:
   - Interactive light switch in the navbar that dims the cinema auditorium lighting to focus viewer attention on the silver screen.

9. **Embedded 4K Trailer Theater**:
   - Watch official trailers in high definition without leaving the page.

---

## 📁 Clean, Modular Project Structure

```
popcornpulse/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Actions deployment to GitHub Pages
├── server/                         # Modular Express Backend
│   ├── src/
│   │   ├── config/                 # Env loader, CORS & business settings
│   │   ├── data/                   # Seed catalog & persistent storage
│   │   ├── repositories/           # Data access abstraction
│   │   ├── services/               # Domain business logic (movies, bookings, reviews, events)
│   │   ├── controllers/            # Request handlers with standard JSend envelopes
│   │   ├── routes/                 # Modular express routing
│   │   ├── middleware/             # Logger, error handler, input validators
│   │   ├── utils/                  # Standardized API response helpers
│   │   ├── app.js                  # Application factory
│   │   └── index.js                # Server entry point
│   ├── prisma/
│   └── package.json
│
├── src/                            # Polished React 19 Frontend
│   ├── components/
│   │   ├── common/                 # Icons, Badge, Toast notifications
│   │   ├── layout/                 # Navbar, Footer
│   │   ├── cinema/                 # HeroBanner, MovieCard, FilterBar, TrailerModal
│   │   ├── booking/                # BookingModal, ShowtimesList
│   │   ├── concessions/            # ConcessionsMenu
│   │   ├── community/              # CommunityEvents, PulseReviews
│   │   ├── analytics/              # CinemaAnalytics
│   │   └── watchlist/              # WatchlistDrawer
│   ├── context/                    # CinemaContext global state provider
│   ├── data/                       # Client seed data fallback
│   ├── services/                   # Resilient API client
│   ├── App.jsx                     # Root application coordinator
│   ├── App.css                     # Cyber-cinema dark stylesheet
│   └── main.jsx
│
├── index.html                      # Preloaded Google Fonts & metadata
├── vite.config.js                  # Configured with relative base for seamless hosting
└── package.json
```

---

## 🚀 Getting Started

### 1. Start the Backend Server (Express API)
```bash
npm run server
```
Backend API will be running on `http://localhost:5000/api`.

### 2. Start the Frontend (Vite + React)
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized, minified production bundle in `dist/`.

---

## 📡 Key REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health probe & system telemetry |
| `GET` | `/api/movies` | Fetch movies with search, genre, status & sort |
| `GET` | `/api/movies/:id` | Fetch movie details with showtimes and reviews |
| `POST` | `/api/movies` | Add new movie to catalog |
| `GET` | `/api/bookings/showtimes` | Fetch showtimes and seat availability |
| `POST` | `/api/bookings/reservations` | Reserve seats with collision check and issue digital pass |
| `GET` | `/api/reviews` | Fetch community reviews |
| `POST` | `/api/reviews` | Submit 4-axis review with calculated pulse score |
| `POST` | `/api/reviews/:id/upvote` | Upvote helpful review |
| `GET` | `/api/events` | List community movie night watch parties |
| `POST` | `/api/events/:id/rsvp` | RSVP for watch party |
| `GET` | `/api/concessions` | Fetch snack and beverage menu |
| `GET` | `/api/stats` | Real-time platform analytics & genre stats |
