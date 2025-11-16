// src/utils/formatDate.ts
// Shared helper for turning API date strings into readable text

/**
 * Format an ISO-8601 date string into a human-readable format.
 *
 * @param value - ISO-8601 date string (for example "2025-11-16T02:13.123Z")
 * @returns A formatted date like "Nov 16, 2025" or null if the value is missing or invalid.
 */
export function formatDate(value?: string): string | null {
  if (!value) return null;

  const date = new Date(value);

  // If the date cannot be parsed, return null
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  try {
    // Modern formatting support
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    // Fallback for older browsers
    return date.toDateString();
  }
}
