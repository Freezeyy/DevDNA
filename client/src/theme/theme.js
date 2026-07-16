import { createTheme } from '@mui/material/styles';

/**
 * DevDNA visual system.
 * Direction: "developer lab" — deep ink canvas, a bright bio-teal signal
 * color evoking DNA/analysis, and an expressive geometric display face
 * (Space Grotesk) paired with Sora for readable body copy.
 */
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#2dd4bf', contrastText: '#04121a' },
    secondary: { main: '#f97362' },
    background: {
      default: '#070b14',
      paper: 'rgba(20, 27, 43, 0.72)',
    },
    text: {
      primary: '#eaf0ff',
      secondary: '#94a3c4',
    },
    divider: 'rgba(148, 163, 196, 0.16)',
    success: { main: '#4ade80' },
    warning: { main: '#fbbf24' },
  },
  typography: {
    fontFamily: '"Sora", system-ui, sans-serif',
    h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, letterSpacing: '-0.02em' },
    h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(148, 163, 196, 0.14)',
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 20 },
      },
    },
  },
});

export default theme;
