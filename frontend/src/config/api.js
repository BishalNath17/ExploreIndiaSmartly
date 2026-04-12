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

/**
 * Resolve an image path: if it starts with /uploads/, prepend the backend base URL.
 * Otherwise return as-is (it's either a full URL or a local public asset).
 */
export const resolveImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('/uploads/')) return `${API_BASE}${imagePath}`;
  return imagePath;
};
