import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * Shared full-height state view for loading and error scenarios.
 */
export default function StatusView({ loading, error, username, onRetry, onHome }) {
  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 2,
      }}
    >
      {loading && (
        <>
          <Box
            component={motion.div}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
            sx={{ display: 'grid', placeItems: 'center' }}
          >
            <CircularProgress color="primary" />
          </Box>
          <Typography variant="h6">Sequencing @{username}…</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Fetching repositories and analyzing patterns.
          </Typography>
        </>
      )}

      {error && (
        <>
          <Typography variant="h5">Couldn&apos;t analyze @{username}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 420 }}>
            {error}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
            <Button variant="contained" onClick={onRetry}>
              Try again
            </Button>
            <Button variant="outlined" color="inherit" onClick={onHome}>
              Back home
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
