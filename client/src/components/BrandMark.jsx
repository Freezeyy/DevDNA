import { Box, Typography } from '@mui/material';

/**
 * DevDNA wordmark with a small DNA-helix glyph. Used as the primary brand
 * signal in the hero and header.
 */
export default function BrandMark({ size = 'md' }) {
  const scale = size === 'lg' ? 1.6 : size === 'sm' ? 0.85 : 1;

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.2 }}>
      <Box
        aria-hidden
        sx={{
          width: 34 * scale,
          height: 34 * scale,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id="dna" x1="0" y1="0" x2="32" y2="32">
              <stop stopColor="#2dd4bf" />
              <stop offset="1" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
          <path d="M9 4c0 6 14 6 14 12S9 22 9 28" stroke="url(#dna)" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M23 4c0 6-14 6-14 12s14 6 14 12" stroke="url(#dna)" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
          <line x1="11" y1="9" x2="21" y2="9" stroke="#2dd4bf" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="12" y1="16" x2="20" y2="16" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="11" y1="23" x2="21" y2="23" stroke="#2dd4bf" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </Box>
      <Typography
        component="span"
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: `${1.4 * scale}rem`,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        Dev
        <Box component="span" sx={{ color: 'primary.main' }}>
          DNA
        </Box>
      </Typography>
    </Box>
  );
}
