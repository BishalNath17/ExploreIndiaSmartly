# 📖 Developer Documentation — Explore India Smartly

This document explains the internal architecture, data structures, and logic modules in detail so that any developer (even a beginner) can confidently edit and extend the project.

---

## Table of Contents

1. [Routing System](#1-routing-system)
2. [Pages Overview](#2-pages-overview)
3. [Component Architecture](#3-component-architecture)
4. [Data Files & Schemas](#4-data-files--schemas)
5. [Budget Planner Logic](#5-budget-planner-logic)
6. [Itinerary Generator Logic](#6-itinerary-generator-logic)
7. [Mapbox Integration](#7-mapbox-integration)
8. [API Service Layer](#8-api-service-layer)
9. [Styling & Design System](#9-styling--design-system)
10. [Adding New Content](#10-adding-new-content)

---

## 1. Routing System

**Files:** `src/routes/AppRouter.jsx`, `src/routes/routeConfig.jsx`

All routes are defined in `routeConfig.jsx` as a simple array:

```js
{ path: '/',                    element: <HomePage /> }
{ path: '/states',              element: <AllStatesPage /> }
{ path: '/state/:stateSlug',    element: <StateDetailsPage /> }
{ path: '/destination/:destSlug', element: <DestinationDetailsPage /> }
{ path: '/budget-planner',      element: <BudgetPlannerPage /> }
{ path: '/travel-planner',      element: <TravelPlannerPage /> }
{ path: '/safety-tips',         element: <SafetyTipsPage /> }
{ path: '/hidden-gems',         element: <HiddenGemsPage /> }
{ path: '*',                    element: <NotFoundPage /> }
```

**How it works:**
- `AppRouter.jsx` wraps all routes inside a shared `<Layout />` component (Navbar + Footer).
- Dynamic routes use `:stateSlug` and `:destSlug` params — the page components use `useParams()` to look up matching data.
- The `*` wildcard catches any unknown URL and shows a 404 page.

**To add a new page:**
1. Create the page file in `src/pages/`.
2. Add an entry to the `routeConfig` array.
3. Optionally add a link in `src/data/navLinks.js`.

---

## 2. Pages Overview

| Page | Route | Description |
|---|---|---|
| `HomePage` | `/` | Hero section, featured states, popular destinations, hidden gems preview, safety tips preview, budget CTA, newsletter |
| `AllStatesPage` | `/states` | Grid of all state cards |
| `StateDetailsPage` | `/state/:stateSlug` | Hero banner, about section, info cards, destinations grid, hidden gems, interactive map, explore more CTA |
| `DestinationDetailsPage` | `/destination/:destSlug` | Hero, about, info cards, itinerary hints, nearby places, travel tips, map, explore CTA |
| `BudgetPlannerPage` | `/budget-planner` | Form (state, days, travelers, style) → detailed budget breakdown with per-day and total costs |
| `TravelPlannerPage` | `/travel-planner` | Form (state, days, style) → day-by-day itinerary with images, descriptions, and daily costs |
| `HiddenGemsPage` | `/hidden-gems` | Region filter tabs + search + grid of hidden gem cards |
| `SafetyTipsPage` | `/safety-tips` | Emergency contacts card + collapsible safety tip categories |
| `NotFoundPage` | `*` | 404 fallback with "Back to Home" button |

**Invalid slug handling:** Both `StateDetailsPage` and `DestinationDetailsPage` check if the slug matches any data entry. If not, they render a dedicated "Not Found" fallback component — the app never shows a blank white screen.

---

## 3. Component Architecture

Components are organized into **4 domain folders** inside `src/components/`:

### `layout/` — Structural UI
| Component | Purpose |
|---|---|
| `Layout.jsx` | Wraps all pages with Navbar + Footer via `<Outlet />` |
| `Navbar.jsx` | Scroll-aware transparent-to-glass navbar with mobile drawer |
| `Footer.jsx` | Site footer with quick links |
| `PageHero.jsx` | Reusable gradient hero banner with badge, title, subtitle |
| `SectionHeader.jsx` | Consistent section title + subtitle styling |

### `cards/` — Data Display Cards
| Component | Purpose |
|---|---|
| `StateCard.jsx` | State preview card with image and name |
| `DestinationCard.jsx` | Full-height destination card with gradient overlay, rating, hover effects |
| `HiddenGemCard.jsx` | Gem card with location badge, optional link-to-state behavior |
| `InfoCard.jsx` | Glassmorphism icon + label + value info card |

### `features/` — Complex Interactive Components
| Component | Purpose |
|---|---|
| `MapboxViewer.jsx` | Mapbox GL map with marker, tooltip, and graceful fallback UI |
| `SearchBar.jsx` | Debounced global search with keyboard navigation and animated dropdown |
| `Newsletter.jsx` | Email subscription CTA section |

### `ui/` — Simple Reusable Utilities
| Component | Purpose |
|---|---|
| `ScrollReveal.jsx` | Framer Motion fade-up animation wrapper (used sparingly on section headers) |
| `EmptyState.jsx` | "No data" placeholder with icon and message |

---

## 4. Data Files & Schemas

All static data lives in `src/data/`. Each file exports a JavaScript array of objects.

### `states.js` — Indian States & Union Territories

```js
{
  slug: 'rajasthan',              // URL-safe key, must be unique kebab-case
  name: 'Rajasthan',              // Display name
  tagline: 'The Land of Kings',   // Short tagline
  type: 'state',                  // 'state' or 'ut'
  image: 'https://...',           // Cover image URL
  intro: '...',                   // About paragraph (2-3 sentences)
  bestTime: 'October – March',    // Best season
  budgetRange: '₹2,000 – ...',   // Daily budget range string
  coords: { lat: 26.9, lng: 75.7 }, // Map center coordinates
  topDestinations: ['jaipur', ...],  // Array of destination slugs
  travelNotes: '...',             // Optional travel advisory
}
```

### `destinations.js` — Popular Destinations

```js
{
  id: 1,                          // Unique number
  slug: 'jaipur',                 // URL-safe key
  title: 'Jaipur, Rajasthan',     // Display title
  state: 'rajasthan',             // Must match a state slug
  description: '...',             // Short blurb
  image: 'https://...',           // Card image URL
  rating: 4.7,                    // Star rating (out of 5)
  coords: { lat: 26.9, lng: 75.8 }, // Optional map coordinates
  bestTime: 'October – March',    // Optional
  tips: ['...'],                  // Optional array of travel tip strings
  itineraryHints: ['...'],        // Optional suggested itinerary steps
}
```

### `hiddenGems.js` — Offbeat Places

```js
{
  slug: 'spiti-valley',           // URL-safe key
  name: 'Spiti Valley',           // Display name
  location: 'Himachal Pradesh',   // Human-readable location
  state: 'himachal-pradesh',      // Must match a state slug
  description: '...',
  image: 'https://...',
}
```

### `safetyTips.js` — Safety Categories & Tips

```js
{
  category: 'Scam Awareness',     // Category title
  categoryIcon: AlertTriangle,    // Lucide icon component
  tips: [
    {
      title: 'Fixed-Price Taxis',
      text: 'Always negotiate or use meter...',
      icon: Car,                  // Lucide icon component
    },
  ],
}
```

### `navLinks.js` — Navigation Links

```js
{ path: '/states', label: 'Explore' }
```

---

## 5. Budget Planner Logic

**File:** `src/utils/budgetCalculator.js`

### How It Works

1. **Base rates** are defined per travel style (budget / standard / premium) across 5 categories: stay, food, transport, sightseeing, extras.
2. A **region multiplier** adjusts costs by state (e.g., Goa is 1.35× more expensive, Bihar is 0.8×).
3. The formula: `per-day cost = base rate × region multiplier`, then `total = per-day × days × travelers`.

### Key Exports

| Function | Purpose |
|---|---|
| `calculateBudget({ stateSlug, days, travelers, style })` | Returns full breakdown object |
| `getRegionMultiplier(stateSlug)` | Returns the cost multiplier for a state |
| `STYLE_OPTIONS` | Array of `{ value, label, emoji, description }` for UI dropdowns |
| `CATEGORY_LABELS` | Maps category keys to human-readable labels |
| `formatINR(amount)` | Formats a number as `₹1,23,456` |

### How to Customize

- **Change base prices:** Edit the `BASE_RATES` object at the top.
- **Change regional pricing:** Edit the `REGION_MULTIPLIERS` object. Use the state's `slug` as the key.
- **Add a cost category:** Add it to `BASE_RATES`, the `categories` array, and `CATEGORY_LABELS`.

---

## 6. Itinerary Generator Logic

**File:** `src/utils/itineraryGenerator.js`

### How It Works

1. Filters `destinations` and `hiddenGems` arrays for the selected state.
2. Shuffles them randomly for variety, prioritizing major destinations.
3. Distributes 1–2 places per day across the trip duration.
4. Generates dynamic titles: "Day 1: Arrival & Acclimatization", "Day N: Final Highlights & Departure".
5. Attaches daily cost data from `calculateBudget()`.

### Output Shape

```js
[
  {
    day: 1,
    title: 'Day 1: Arrival & Acclimatization',
    description: 'Arrive, settle in, and explore Jaipur.',
    locations: [{ title, image, ... }],  // Destination/gem objects
    costs: { stay, food, transport, sightseeing, extras, total },
  },
  ...
]
```

### How to Customize

- **Change places per day:** Modify the distribution logic inside the `for` loop.
- **Change day titles:** Edit the conditional title strings (lines 52–67).
- **Add more data:** Simply add more entries to `destinations.js` or `hiddenGems.js` — the generator automatically includes them.

---

## 7. Mapbox Integration

**File:** `src/components/features/MapboxViewer.jsx`

### Setup

1. Get a free Mapbox token from [mapbox.com](https://www.mapbox.com).
2. Add to `frontend/.env`: `VITE_MAPBOX_TOKEN=pk.your_token_here`
3. The component reads it via `import.meta.env.VITE_MAPBOX_TOKEN`.

### Safety Fallbacks

The component handles **three failure cases** gracefully (no crashes):

| Scenario | Behavior |
|---|---|
| Token missing or placeholder | Shows "Mapbox token is missing" message with setup instructions |
| Coordinates missing | Shows "Location Data Unavailable" fallback |
| Both present and valid | Renders interactive 3D map with navigation controls and marker |

### Where Coordinates Are Used

- `StateDetailsPage` reads `state.coords` from `states.js`.
- `DestinationDetailsPage` reads `dest.coords` from `destinations.js`.
- Both pass coordinates through a ternary guard (`coords ? [coords.lng, coords.lat] : undefined`) to avoid crashes on missing data.

---

## 8. API Service Layer

**File:** `src/services/api.js`

This is a bridge between the UI and data sources. It provides two modes:

### Current Mode (Local)

Pages import sync functions that use local mock data:
```js
import { calculateBudget, generateItinerary } from '../services/api';
```

### Future Mode (Backend)

When the Express backend is ready:
1. Set `USE_BACKEND = true` in `api.js`.
2. Switch page imports to async variants: `fetchBudget()`, `fetchItinerary()`.
3. If the API call fails, it **automatically** falls back to local calculations.

### Backend Endpoints (Expected)

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/health` | Health check |
| `POST` | `/api/v1/budget/calculate` | Server-side budget calculation |
| `POST` | `/api/v1/itinerary/generate` | Server-side itinerary generation |

---

## 9. Styling & Design System

- **Framework:** Tailwind CSS v4 (configured via `index.css`).
- **Color Palette:** Dark navy background (`--color-navy`, `--color-navy-dark`) with India orange accents (`--color-india-orange`).
- **Glass Effect:** `.glass` class applies `backdrop-blur + bg-white/5 + border-white/10`.
- **Typography:** System fonts with `font-sans` for body and `font-serif` for branded headings.
- **Responsive:** Mobile-first design using Tailwind breakpoints (`sm:`, `md:`, `lg:`). All grids collapse to single columns on mobile.

---

## 10. Adding New Content

### Add a New State

1. Open `frontend/src/data/states.js`.
2. Copy an existing state object.
3. Change all fields (use a unique `slug` in kebab-case).
4. Add `coords` for the map.
5. The state automatically appears on the All States page and in the search bar.

### Add a New Destination

1. Open `frontend/src/data/destinations.js`.
2. Add a new object with a unique `id` and `slug`.
3. Set `state` to match the parent state's `slug`.
4. It automatically appears on the parent state's detail page and in global search.

### Add a New Hidden Gem

1. Open `frontend/src/data/hiddenGems.js`.
2. Add a new object with a unique `slug`.
3. Set `state` to match the parent state's `slug`.
4. It appears on the Hidden Gems page and the parent state's detail page.

### Add a New Page

1. Create `src/pages/YourPage.jsx`.
2. Add a route entry in `src/routes/routeConfig.jsx`.
3. Add a nav link in `src/data/navLinks.js` if needed.

---

*Last updated: March 2026*
