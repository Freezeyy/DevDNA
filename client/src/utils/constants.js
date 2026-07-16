/**
 * Fallback palette for charts when GitHub language colors are unavailable.
 * Ordered for good contrast on a dark surface.
 */
export const CHART_COLORS = [
  '#5eead4', // teal
  '#a78bfa', // violet
  '#f472b6', // pink
  '#fbbf24', // amber
  '#60a5fa', // blue
  '#34d399', // emerald
  '#fb7185', // rose
  '#c084fc', // purple
  '#facc15', // yellow
  '#38bdf8', // sky
];

export function scoreLabel(score) {
  if (score >= 80) return 'Elite';
  if (score >= 65) return 'High Impact';
  if (score >= 45) return 'Established';
  if (score >= 25) return 'Growing';
  return 'Emerging';
}
