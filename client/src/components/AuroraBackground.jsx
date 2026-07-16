import { Box } from '@mui/material';

/**
 * Decorative, non-interactive backdrop: two slow-drifting blurred orbs that
 * add motion and depth behind page content. Purely aesthetic.
 */
export default function AuroraBackground() {
  const orb = {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(90px)',
    opacity: 0.5,
    pointerEvents: 'none',
  };

  return (
    <Box aria-hidden sx={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <Box
        sx={{
          ...orb,
          top: '-12%',
          left: '-6%',
          width: 520,
          height: 520,
          background: 'radial-gradient(circle, rgba(45,212,191,0.55), transparent 65%)',
          animation: 'drift 18s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          ...orb,
          bottom: '-16%',
          right: '-8%',
          width: 560,
          height: 560,
          background: 'radial-gradient(circle, rgba(96,165,250,0.45), transparent 65%)',
          animation: 'drift 22s ease-in-out infinite reverse',
        }}
      />
      <Box
        sx={{
          ...orb,
          top: '30%',
          right: '20%',
          width: 340,
          height: 340,
          opacity: 0.35,
          background: 'radial-gradient(circle, rgba(249,115,98,0.5), transparent 65%)',
          animation: 'drift 26s ease-in-out infinite',
        }}
      />
    </Box>
  );
}
