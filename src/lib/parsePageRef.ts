/**
 * Parse a pageRef string like "p6-7" into an array of page numbers [6, 7].
 * Handles single pages ("p9" → [9]) and ranges ("p28-30" → [28, 29, 30]).
 */
export function parsePageRef(pageRef: string): number[] {
  const stripped = pageRef.replace(/^p/i, '');
  const parts = stripped.split('-');
  const start = parseInt(parts[0], 10);

  if (parts.length === 1 || isNaN(parseInt(parts[1], 10))) {
    return [start];
  }

  const end = parseInt(parts[1], 10);
  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}

/**
 * Convert a page number to its image URL path.
 * pageImageUrl(6) → "/pdf-pages/page-006.png"
 */
export function pageImageUrl(pageNumber: number): string {
  return `/pdf-pages/page-${String(pageNumber).padStart(3, '0')}.png`;
}
