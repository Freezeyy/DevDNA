import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Stack, Chip } from '@mui/material';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import DataUsageRoundedIcon from '@mui/icons-material/DataUsageRounded';
import { motion } from 'framer-motion';
import BrandMark from '../components/BrandMark.jsx';
import SearchBar from '../components/SearchBar.jsx';
import AuroraBackground from '../components/AuroraBackground.jsx';

const MotionBox = motion(Box);

const SAMPLES = ['torvalds', 'gaearon', 'sindresorhus', 'yyx990803'];

const FEATURES = [
  { icon: DataUsageRoundedIcon, label: 'Language DNA' },
  { icon: InsightsRoundedIcon, label: 'Developer Score' },
  { icon: AutoAwesomeRoundedIcon, label: 'AI Insights' },
];

export default function HomePage() {
  const navigate = useNavigate();

  const go = (username) => navigate(`/u/${encodeURIComponent(username)}`);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <AuroraBackground />

      <Container maxWidth="lg" sx={{ pt: 4, position: 'relative', zIndex: 1 }}>
        <BrandMark />
      </Container>

      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: { xs: 8, md: 10 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <Chip
            label="Public GitHub analytics"
            size="small"
            sx={{
              mb: 3.5,
              px: 0.5,
              color: 'text.secondary',
              bgcolor: 'rgba(148,163,196,0.08)',
              border: '1px solid rgba(148,163,196,0.18)',
              backdropFilter: 'blur(8px)',
            }}
          />

          <Typography
            component="h1"
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              lineHeight: 0.96,
              letterSpacing: '-0.04em',
              fontSize: { xs: '3.2rem', sm: '4.5rem', md: '6rem' },
            }}
          >
            Decode your
            <Box
              component="span"
              sx={{
                display: 'block',
                backgroundImage:
                  'linear-gradient(100deg, #2dd4bf 0%, #60a5fa 40%, #f97362 70%, #2dd4bf 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmer 6s linear infinite',
              }}
            >
              developer DNA
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 3,
              mx: 'auto',
              maxWidth: 560,
              color: 'text.secondary',
              fontSize: { xs: '1.05rem', md: '1.2rem' },
            }}
          >
            Enter a GitHub username and DevDNA analyzes their public work into a
            living developer profile — scores, languages, and AI insights. More if you pay!!
          </Typography>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          sx={{ mt: 5, width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <SearchBar onSubmit={go} autoFocus />
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          sx={{ mt: 3 }}
        >
          <Stack direction="row" spacing={1.5} flexWrap="wrap" justifyContent="center" useFlexGap>
            <Typography variant="body2" sx={{ color: 'text.secondary', mr: 0.5 }}>
              Try:
            </Typography>
            {SAMPLES.map((name) => (
              <Typography
                key={name}
                component="button"
                onClick={() => go(name)}
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  color: 'primary.main',
                  fontFamily: 'inherit',
                  p: 0,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {name}
              </Typography>
            ))}
          </Stack>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          sx={{ mt: 6 }}
        >
          <Stack direction="row" spacing={{ xs: 2, sm: 4 }} justifyContent="center" flexWrap="wrap" useFlexGap>
            {FEATURES.map((f) => (
              <Stack key={f.label} direction="row" spacing={1} alignItems="center">
                <f.icon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {f.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </MotionBox>
      </Container>
    </Box>
  );
}
