/**
 * Centralized API configuration — Explore India Smartly
 *
 * All API base URLs are derived from the VITE_API_URL environment variable.
 * Set VITE_API_URL in your .env (local) or in Render dashboard (production).
 *
 * Examples:
 *   Local:      VITE_API_URL=http://localhost:5000/api/v1
 *   Production: VITE_API_URL=https://your-render-app.onrender.com/api/v1
 */

/** Full API URL including /api/v1 path — use for API fetch calls */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/** Server base URL without /api/v1 — use for resolving uploaded file paths (e.g. /uploads/...) */
export const API_BASE = API_URL.replace('/api/v1', '');

// Cache-busting mechanism defined once globally per app-load to avoid render loop flickering.
const APP_TIMESTAMP = Date.now();

/**
 * Resolve an image path natively across deployment environments.
 * If image path starts with /images/ or /uploads/, we proxy it to the backend base URL.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/fallback.jpg'; // Safe fallback
  if (imagePath.startsWith('http')) return imagePath;

  const cacheSuffix = `?t=${APP_TIMESTAMP}`;

  if (imagePath.startsWith('/images/') || imagePath.startsWith('/uploads/')) {
    return `${API_BASE}${imagePath}${cacheSuffix}`;
  }
  return imagePath + cacheSuffix;
};

// Aliased for existing implementation compatability
export const resolveImageUrl = getImageUrl;
