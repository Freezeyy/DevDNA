/**
 * Presentation helpers shared across components.
 */

export function formatNumber(n) {
  if (n === null || n === undefined) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function relativeYears(value) {
  if (!value) return '';
  const years = (Date.now() - new Date(value).getTime()) / (365 * 24 * 60 * 60 * 1000);
  if (years < 1) return 'this year';
  return `${Math.floor(years)}+ yr on GitHub`;
}
