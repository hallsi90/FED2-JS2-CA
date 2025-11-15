// src/utils/formatDate.ts
// Shared helper for turning API date strings into readable text

/**
 * Format date string to readable format
 *
 * @param value - ISO-8601 date string (for example "2025-11-16T02:13.123Z")
 * @returns A formatted date like "Nov 16, 2025" or null if the value is missing or invalid.
 */
export function formatDate(value?: string): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
