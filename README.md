# 🧭 Explore India Smartly

A premium, mobile-first travel platform built with **React + Vite** that helps users discover Indian states, popular destinations, hidden gems, and plan trips with smart budget and itinerary tools.

---

## ✨ Features

- **Explore by State** — Browse all 28 states and 8 union territories with detailed pages, maps, and travel tips.
- **Destination Discovery** — Curated destination cards with ratings, descriptions, and map coordinates.
- **Hidden Gems** — Offbeat, lesser-known places with region-based filtering.
- **Budget Planner** — Instant cost estimates by state, duration, traveler count, and travel style (Budget / Standard / Premium).
- **Day-wise Itinerary Generator** — Auto-generates a day-by-day travel plan based on the selected state and trip duration.
- **Interactive Maps** — Mapbox GL integration with graceful fallbacks when tokens or coordinates are missing.
- **Safety Tips** — Collapsible category-based travel safety advice and emergency contacts.
- **Global Search** — Debounced search across states, destinations, and hidden gems with keyboard navigation.

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ and npm

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/explore-india-smartly.git
cd explore-india-smartly
```

### 2. Set Up the Frontend

```bash
cd frontend
cp .env.example .env        # then edit .env with your real values
npm install
npm run dev                  # starts on http://localhost:5173
```

### 3. Set Up the Backend (optional)

```bash
cd backend
cp .env.example .env
npm install
npm run dev                  # starts on http://localhost:5000
```

> **Note:** The frontend works 100% standalone using local mock data. The backend is optional and prepared for future API migration.

---

## 🔑 Environment Variables

### Frontend (`frontend/.env`)

| Variable | Purpose | Example |
|---|---|---|
| `VITE_MAPBOX_TOKEN` | Mapbox GL public access token for interactive maps | `pk.eyJ1Ijoi...` |
| `VITE_API_BASE_URL` | Backend API base URL (used when backend is enabled) | `http://localhost:5000/api/v1` |

### Backend (`backend/.env`)

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `MAPBOX_SECRET_TOKEN` | Mapbox secret token for server-side geocoding | `sk.eyJ1Ijoi...` |

> ⚠️ **Never commit `.env` files.** The `.gitignore` files in the root, frontend, and backend directories all block `.env*` files.

---

## 📁 Project Structure

```
explore-india-smartly/
├── .gitignore                    # Root-level Git ignore rules
├── README.md                     # ← You are here
├── DOCS.md                       # Detailed developer documentation
│
├── frontend/
│   ├── .env                      # Your local env vars (git-ignored)
│   ├── .env.example              # Template showing required vars
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json               # Vercel SPA routing config
│   └── src/
│       ├── main.jsx              # React entry point
│       ├── App.jsx               # Root component → AppRouter
│       ├── index.css             # Global styles + Tailwind
│       │
│       ├── routes/
│       │   ├── AppRouter.jsx     # BrowserRouter + Layout wrapper
│       │   └── routeConfig.jsx   # All route → page mappings
│       │
│       ├── pages/                # One file per route
│       │   ├── HomePage.jsx
│       │   ├── AllStatesPage.jsx
│       │   ├── StateDetailsPage.jsx
│       │   ├── DestinationDetailsPage.jsx
│       │   ├── BudgetPlannerPage.jsx
│       │   ├── TravelPlannerPage.jsx
│       │   ├── HiddenGemsPage.jsx
│       │   ├── SafetyTipsPage.jsx
│       │   └── NotFoundPage.jsx
│       │
│       ├── components/
│       │   ├── layout/           # Structural UI (Navbar, Footer, Layout)
│       │   ├── cards/            # Data display cards (State, Destination, etc.)
│       │   ├── features/         # Complex interactive components (Map, Search)
│       │   └── ui/               # Simple reusable UI (EmptyState, ScrollReveal)
│       │
│       ├── data/                 # Static JSON-like data arrays
│       │   ├── states.js         # All 36 states & UTs
│       │   ├── destinations.js   # Popular destinations
│       │   ├── hiddenGems.js     # Offbeat places
│       │   ├── safetyTips.js     # Safety tip categories
│       │   └── navLinks.js       # Navigation link config
│       │
│       ├── utils/                # Pure logic (no UI)
│       │   ├── budgetCalculator.js
│       │   ├── itineraryGenerator.js
│       │   └── animations.js
│       │
│       ├── hooks/
│       │   └── useScrollDirection.js
│       │
│       └── services/
│           └── api.js            # API abstraction layer
│
└── backend/
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── package.json
    └── src/
        ├── server.js             # Entry point
        ├── app.js                # Express app config
        ├── routes/               # API route definitions
        └── controllers/          # Route handler logic
```

---

## 🛠 How to Edit Content

| What to change | File to edit | Notes |
|---|---|---|
| Add/edit a state | `frontend/src/data/states.js` | Follow the data shape documented at the top of the file |
| Add/edit a destination | `frontend/src/data/destinations.js` | The `state` field must match a state's `slug` |
| Add/edit a hidden gem | `frontend/src/data/hiddenGems.js` | Same `state` slug rule applies |
| Change budget rates | `frontend/src/utils/budgetCalculator.js` | Edit `BASE_RATES` or `REGION_MULTIPLIERS` |
| Change itinerary logic | `frontend/src/utils/itineraryGenerator.js` | Modify how places are distributed per day |
| Update map coordinates | `states.js` → `coords: { lat, lng }` | Used by `MapboxViewer` on detail pages |
| Add navigation links | `frontend/src/data/navLinks.js` | Array of `{ path, label }` objects |
| Update safety tips | `frontend/src/data/safetyTips.js` | Nested `{ category, tips: [{ title, text, icon }] }` |

---

## 📜 Available Scripts

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Create production bundle in `dist/` |
| `npm run preview` | Preview the production build locally |

### Backend

| Command | Description |
|---|---|
| `npm run dev` | Start Express server with nodemon |
| `npm start` | Start server (production) |

---

## 🗺 Mapbox Setup

1. Create a free account at [mapbox.com](https://www.mapbox.com/).
2. Copy your **public token** (starts with `pk.`).
3. Paste it into `frontend/.env` as `VITE_MAPBOX_TOKEN`.
4. If the token is missing or invalid, the map gracefully shows a "Location Data Unavailable" fallback — the app will **not** crash.

---

## 🔮 Backend Integration Strategy

The frontend is designed for a smooth future migration to a live backend:

1. The `frontend/src/services/api.js` file contains both **sync** (local) and **async** (API) variants of budget and itinerary functions.
2. Today, pages use the sync exports (`calculateBudget`, `generateItinerary`) which work purely with local data.
3. When the backend is ready, change `USE_BACKEND = true` in `api.js` and swap page imports to the async variants (`fetchBudget`, `fetchItinerary`).
4. If the backend call fails, it automatically falls back to local calculations — zero downtime.

---

## 📄 License

MIT — built for learning and exploration.
