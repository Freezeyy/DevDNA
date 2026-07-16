import { Paper, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

/**
 * Consistent dashboard surface with an optional title and action slot.
 * Dashboards are the sanctioned exception to the "no cards" rule.
 */
export default function Panel({ title, action, children, sx, delay = 0 }) {
  return (
    <MotionPaper
      elevation={0}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      sx={{
        position: 'relative',
        p: { xs: 2.2, md: 2.8 },
        borderRadius: 3,
        height: '100%',
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, rgba(24, 32, 51, 0.82) 0%, rgba(15, 21, 36, 0.82) 100%)',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          borderColor: 'rgba(45, 212, 191, 0.4)',
          boxShadow: '0 18px 50px -22px rgba(45, 212, 191, 0.45)',
        },
        // Gradient hairline accent across the top edge.
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1.5px',
          background:
            'linear-gradient(90deg, transparent, rgba(45,212,191,0.7), rgba(96,165,250,0.7), transparent)',
          opacity: 0.7,
        },
        ...sx,
      }}
    >
      {(title || action) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2.2,
            gap: 1,
          }}
        >
          {title && (
            <Typography
              variant="overline"
              sx={{
                fontSize: '0.72rem',
                letterSpacing: '0.14em',
                color: 'text.secondary',
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>
          )}
          {action}
        </Box>
      )}
      {children}
    </MotionPaper>
  );
}
