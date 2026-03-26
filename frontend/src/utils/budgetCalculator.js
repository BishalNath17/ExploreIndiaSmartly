/**
 * Budget Calculator — modular cost-estimation logic.
 *
 * All per-day base rates are mock data in INR. The structure is designed so
 * that each function can later be swapped for a backend API call without
 * changing the UI layer.
 *
 * COST CATEGORIES: stay, food, transport, sightseeing, extras
 * TRAVEL STYLES : budget, standard, premium
 */

/* ── Per-day base rates (INR) by travel style ──────── */
const BASE_RATES = {
  budget:   { stay: 800,  food: 400,  transport: 300,  sightseeing: 200, extras: 150 },
  standard: { stay: 2500, food: 900,  transport: 700,  sightseeing: 500, extras: 350 },
  premium:  { stay: 7000, food: 2000, transport: 1800, sightseeing: 1200, extras: 800 },
};

/* ── Region cost multiplier (approximation by state slug) ── */
const REGION_MULTIPLIERS = {
  // Expensive metros / tourist-heavy
  'goa': 1.35, 'delhi': 1.3, 'maharashtra': 1.25, 'karnataka': 1.15,
  'kerala': 1.2, 'rajasthan': 1.2, 'jammu-kashmir': 1.3, 'ladakh': 1.4,
  'andaman-nicobar': 1.45, 'lakshadweep': 1.5, 'sikkim': 1.15,
  'himachal-pradesh': 1.1, 'uttarakhand': 1.1, 'puducherry': 1.1,
  'tamil-nadu': 1.05, 'telangana': 1.05, 'west-bengal': 1.05,
  // Affordable / mid-range
  'uttar-pradesh': 0.95, 'madhya-pradesh': 0.9, 'bihar': 0.8,
  'jharkhand': 0.85, 'chhattisgarh': 0.85, 'odisha': 0.9,
  'assam': 0.9, 'meghalaya': 1.0, 'nagaland': 1.0, 'manipur': 0.95,
  'mizoram': 0.95, 'tripura': 0.85, 'arunachal-pradesh': 1.05,
  'punjab': 1.0, 'haryana': 1.0, 'gujarat': 1.0,
  'andhra-pradesh': 0.95, 'chandigarh': 1.1,
  'dadra-nagar-haveli-daman-diu': 0.95,
};

/**
 * Get the regional cost multiplier for a state slug.
 * Falls back to 1.0 if unknown.
 */
export const getRegionMultiplier = (stateSlug) =>
  REGION_MULTIPLIERS[stateSlug] ?? 1.0;

/**
 * Calculate a full budget breakdown.
 *
 * @param {{ stateSlug: string, days: number, travelers: number, style: 'budget'|'standard'|'premium' }} params
 * @returns {{ perDay: object, totalPerPerson: object, grandTotal: number, perPersonTotal: number, categories: string[] }}
 */
export const calculateBudget = ({ stateSlug, days, travelers, style }) => {
  const base = BASE_RATES[style] || BASE_RATES.standard;
  const multiplier = getRegionMultiplier(stateSlug);

  const categories = ['stay', 'food', 'transport', 'sightseeing', 'extras'];

  // Per-day cost (1 person) adjusted for region
  const perDay = {};
  categories.forEach((cat) => {
    perDay[cat] = Math.round(base[cat] * multiplier);
  });
  const perDayTotal = categories.reduce((sum, cat) => sum + perDay[cat], 0);

  // Total per person
  const totalPerPerson = {};
  categories.forEach((cat) => {
    totalPerPerson[cat] = perDay[cat] * days;
  });
  const perPersonTotal = perDayTotal * days;

  // Grand total
  const grandTotal = perPersonTotal * travelers;

  return { perDay, totalPerPerson, grandTotal, perPersonTotal, perDayTotal, days, travelers, style, categories };
};

/** Human-readable labels for categories */
export const CATEGORY_LABELS = {
  stay: 'Accommodation',
  food: 'Food & Dining',
  transport: 'Transport',
  sightseeing: 'Sightseeing & Activities',
  extras: 'Miscellaneous',
};

/** Human-readable labels for travel styles */
export const STYLE_OPTIONS = [
  { value: 'budget',   label: 'Budget',   emoji: '🎒', description: 'Hostels, street food, public transport' },
  { value: 'standard', label: 'Standard', emoji: '🏨', description: 'Mid-range hotels, restaurants, cabs' },
  { value: 'premium',  label: 'Premium',  emoji: '✨', description: 'Luxury stays, fine dining, private cars' },
];

/** Format INR */
export const formatINR = (amount) =>
  '₹' + amount.toLocaleString('en-IN');
