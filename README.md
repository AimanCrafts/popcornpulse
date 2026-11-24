# 🍿 PopcornPulse — Modern Cinema Discovery & Seat Reservation Platform

[![Deploy to GitHub Pages](https://github.com/AimanCrafts/popcornpulse/actions/workflows/deploy.yml/badge.svg)](https://github.com/AimanCrafts/popcornpulse/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-ffd700?style=flat&logo=github)](https://aimancrafts.github.io/popcornpulse/)
[![React 19](https://img.shields.io/badge/React-19.2-61dafb?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646cff?style=flat&logo=vite)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat&logo=express)](https://expressjs.com/)

> **Live Demo:** [https://aimancrafts.github.io/popcornpulse/](https://aimancrafts.github.io/popcornpulse/)

PopcornPulse is a production-grade cinema experience and movie discovery platform engineered with high-performance modern web standards, layered software design patterns, and an immersive cyber-cinema aesthetic.

---

## 🌟 Key Platform Capabilities

1. **Curated Cinema Discovery & Multi-Axis Filtering**:
   - Status categorization: Now Screening, Coming Soon, and Trending Titles.
   - Comprehensive genre filtering across Sci-Fi, Action, Drama, Animation, Comedy, Romance, Thriller, Horror, and Adventure.
   - Dynamic sorting by Community Pulse Score, Release Year, and Title.
   - Full-text search across movie titles, directors, and ensemble cast.

2. **Interactive Auditorium Seat Matrix & Reservation Flow**:
   - Realistic curved screen geometry (IMAX 70mm, Dolby Cinema, 4DX, ScreenX).
   - Seat states: Available, Selected, Reserved/Occupied, VIP Recliner.
   - Concurrency-safe seat validation preventing double reservations.
   - Digital Cinema Boarding Pass generation with booking reference codes, barcode representations, auditorium information, seat allocations, and print/save capabilities.

3. **Multi-Axis "Pulse" Sentiment & Audience Critiques**:
   - Film evaluation across four foundational cinematic pillars:
     - 📖 Story & Screenplay (1–5 ★)
     - 🎨 Visuals & Scale (1–5 ★)
     - 🎵 Sound Design & Score (1–5 ★)
     - 🍿 Popcorn Entertainment Factor (1–5 ★)
   - Weighted algorithmic Pulse Score calculation.
   - Spoiler protection: Interactive blur overlay with click-to-reveal toggle.
   - Verified cinephile badges and community critique upvotes.

4. **Community Watch Parties & Cinephile Gatherings**:
   - Thematic film events, director retrospectives, and 70mm community marathons.
   - Real-time capacity trackers, venue credentials, and instant RSVP confirmation.

5. **Gourmet Cinema Concessions Bar**:
   - Interactive refreshment tray with real-time quantity steppers.
   - Menu items including artisan black truffle popcorn, craft sodas, Bavarian pretzels, smoked jalapeño nachos, and VIP Director's tasting boards.
   - Seamless checkout integration with cinema ticket reservations.

6. **Real-Time Cinema Pulse Analytics Dashboard**:
   - Telemetry metrics: Weekly tickets issued, aggregate audience sentiment index, auditorium utilization, and genre popularity distributions.

7. **Persistent Watchlist**:
   - Browser-persisted personal watchlist with instant booking shortcuts and badge counters.

8. **Auditorium Ambience Mode ("Dim Lights")**:
   - Interactive light switch in the navigation header that dims auditorium lighting to focus viewer attention on the silver screen.

9. **Embedded 4K Trailer Theater**:
   - Seamless modal overlay to stream official theatrical trailers without leaving the catalog.

---

## 📁 Project Structure

```
popcornpulse/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Actions deployment to GitHub Pages
├── server/                         # Modular Express Backend
│   ├── src/
│   │   ├── config/                 # Environment configuration & business constants
│   │   ├── data/                   # Seed catalog & persistent storage
│   │   ├── repositories/           # Data access layer
│   │   ├── services/               # Domain business logic (movies, bookings, reviews, events)
│   │   ├── controllers/            # Request handlers with standardized response envelopes
│   │   ├── routes/                 # Modular Express routers
│   │   ├── middleware/             # Request logging, error handling, payload validation
│   │   ├── utils/                  # API response formatting and AppError classes
│   │   ├── app.js                  # Express application factory
│   │   └── index.js                # Server entry point
│   └── package.json
│
├── src/                            # Modern React 19 Frontend
│   ├── components/
│   │   ├── common/                 # Reusable atomic UI (Badge, Icons, Toast)
│   │   ├── layout/                 # Navbar, Footer
│   │   ├── cinema/                 # HeroBanner, MovieCard, MovieFilterBar, TrailerModal
│   │   ├── booking/                # BookingModal, ShowtimesList
│   │   ├── concessions/            # ConcessionsMenu
│   │   ├── community/              # CommunityEvents, PulseReviews
│   │   ├── analytics/              # CinemaAnalytics
│   │   └── watchlist/              # WatchlistDrawer
│   ├── context/                    # CinemaContext global application state
│   ├── data/                       # Seed catalog fallback for client-side hosting
│   ├── services/                   # Resilient API client with offline fallback
│   ├── App.jsx                     # Root application coordinator
│   ├── App.css                     # Responsive cyber-cinema design system
│   └── main.jsx                    # React DOM entry point
│
├── index.html                      # Entry HTML with preloaded typography & metadata
├── vite.config.js                  # Vite bundler configuration
└── package.json                    # Project dependencies and build scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AimanCrafts/popcornpulse.git
   cd popcornpulse
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Running Locally

1. **Start the backend API:**
   ```bash
   cd server
   npm run dev
   ```
   *The API will be available at `http://localhost:5000/api`.*

2. **Start the frontend application:**
   ```bash
   npm run dev
   ```
   *Open `http://localhost:5173` in your browser.*

---

## 🛠️ API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck and service uptime status |
| `GET` | `/api/movies` | List movies with optional search, genre, and status filters |
| `GET` | `/api/movies/:id` | Fetch movie details with showtimes and reviews |
| `GET` | `/api/bookings/showtimes` | Fetch showtimes and auditorium seat layouts |
| `POST` | `/api/bookings/reservations` | Reserve auditorium seats and issue digital ticket |
| `GET` | `/api/concessions` | Fetch gourmet refreshments and combo menu |
| `GET` | `/api/events` | List community movie nights and watch parties |
| `POST` | `/api/events/:id/rsvp` | RSVP for a cinephile community gathering |
| `GET` | `/api/reviews` | Retrieve multi-axis audience reviews |
| `POST` | `/api/reviews` | Submit a movie review with weighted Pulse Score |
| `POST` | `/api/reviews/:id/upvote` | Upvote a community review |
| `GET` | `/api/stats` | Retrieve platform telemetry and sentiment metrics |

---

## 📦 Build & Deployment

The application features automated continuous deployment via GitHub Actions:

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

When code is pushed to the `main` branch, `.github/workflows/deploy.yml` builds the client application and deploys it directly to GitHub Pages.

---

## 📄 License

This project is licensed under the MIT License.
