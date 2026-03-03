/**
 * Validates an IMDb ID format: must start with "tt" followed by 7-8 digits
 * Examples: tt0133093 (The Matrix), tt0468569 (The Dark Knight)
 */
export function validateImdbId(id: string): boolean {
  if (!id || typeof id !== "string") return false;
  const trimmed = id.trim();
  return /^tt\d{7,8}$/.test(trimmed);
}

/**
 * Sanitizes an IMDb ID by trimming whitespace and lowercasing "tt" prefix
 */
export function sanitizeImdbId(id: string): string {
  return id.trim().toLowerCase();
}

/**
 * Maps IMDb rating string to a numeric score 0-100
 */
export function ratingToScore(rating: string): number {
  const parsed = parseFloat(rating);
  if (isNaN(parsed)) return 0;
  return Math.round((parsed / 10) * 100);
}
