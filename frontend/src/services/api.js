/**
 * API Service Layer — Explore India Smartly
 *
 * This module provides a clean abstraction between the UI and data sources.
 *
 * HOW IT WORKS:
 * ─────────────
 * 1. TODAY  — Pages import local (synchronous) helpers from this file.
 *             Everything works offline using frontend mock data.
 * 2. LATER  — When backend endpoints are production-ready, flip
 *             USE_BACKEND = true. The async variants (fetchBudget,
 *             fetchItinerary) will call the real API with automatic
 *             local fallback on failure. Swap the page imports from
 *             the sync helpers to the async ones — that's it.
 *
 * The UI components should import from THIS file, so the migration
 * requires minimal changes in page-level code.
 */

import {
  calculateBudget as localCalculateBudget,
  CATEGORY_LABELS,
  STYLE_OPTIONS,
  formatINR,
} from '../utils/budgetCalculator';

import { generateItinerary as localGenerateItinerary } from '../utils/itineraryGenerator';

/* ── Configuration ─────────────────────────────────── */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Feature flag: when true the async helpers will attempt real API calls.
 * If the call fails they fall back to local utilities automatically.
 * Set to `false` to guarantee purely local (offline) operation.
 */
const USE_BACKEND = false;

/* ── Generic fetch wrapper ─────────────────────────── */
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
};

/* ══════════════════════════════════════════════════════
   SYNCHRONOUS RE-EXPORTS  (used by pages TODAY)
   ══════════════════════════════════════════════════════ */

/** Calculate budget locally — synchronous, always works. */
export const calculateBudget = localCalculateBudget;

/** Generate itinerary locally — synchronous, always works. */
export const generateItinerary = localGenerateItinerary;

/** Re-export helpers the pages already rely on. */
export { CATEGORY_LABELS, STYLE_OPTIONS, formatINR };

/* ══════════════════════════════════════════════════════
   ASYNC API METHODS  (use when backend is ready)
   ══════════════════════════════════════════════════════ */

/**
 * Calculate budget via backend (with local fallback).
 * @param {{ stateSlug: string, days: number, travelers: number, style: string }} params
 * @returns {Promise<object>}
 */
export const fetchBudget = async (params) => {
  if (USE_BACKEND) {
    try {
      const res = await apiFetch('/budget/calculate', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      if (res.success && res.data) return res.data;
    } catch (err) {
      console.warn('[api] Budget API failed, using local fallback:', err.message);
    }
  }
  return localCalculateBudget(params);
};

/**
 * Generate itinerary via backend (with local fallback).
 * @param {{ stateSlug: string, days: number, style: string }} params
 * @returns {Promise<Array>}
 */
export const fetchItinerary = async (params) => {
  if (USE_BACKEND) {
    try {
      const res = await apiFetch('/itinerary/generate', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      if (res.success && res.data?.itinerary) return res.data.itinerary;
    } catch (err) {
      console.warn('[api] Itinerary API failed, using local fallback:', err.message);
    }
  }
  return localGenerateItinerary(params);
};

/**
 * Ping backend health check.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const fetchHealthCheck = async () => {
  try {
    return await apiFetch('/health');
  } catch (err) {
    return { success: false, message: err.message };
  }
};
