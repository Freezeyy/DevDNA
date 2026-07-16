import { Box, Typography, Link, Stack } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import CallSplitRoundedIcon from '@mui/icons-material/CallSplitRounded';
import { motion } from 'framer-motion';
import { formatNumber } from '../utils/formatters.js';

const MotionBox = motion(Box);

/**
 * Compact repository card used in the "most active" grid.
 */
export default function RepoCard({ repo, index = 0 }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      sx={{
        p: 2,
        borderRadius: 2,
        height: '100%',
        bgcolor: 'rgba(148,163,196,0.06)',
        border: '1px solid rgba(148,163,196,0.12)',
        transition: 'border-color 0.2s',
        '&:hover': { borderColor: 'rgba(45,212,191,0.4)' },
      }}
    >
      <Link
        href={repo.url}
        target="_blank"
        rel="noreferrer"
        underline="hover"
        sx={{ color: 'text.primary', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif' }}
      >
        {repo.name}
      </Link>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mt: 0.8,
          minHeight: 40,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {repo.description || 'No description provided.'}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 1.4, alignItems: 'center' }}>
        {repo.language && (
          <Typography variant="caption" sx={{ color: 'primary.main' }}>
            {repo.language}
          </Typography>
        )}
        <Stack direction="row" spacing={0.5} alignItems="center">
          <StarRoundedIcon sx={{ fontSize: 16, color: '#fbbf24' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {formatNumber(repo.stars)}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <CallSplitRoundedIcon sx={{ fontSize: 16, color: '#f97362' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {formatNumber(repo.forks)}
          </Typography>
        </Stack>
      </Stack>
    </MotionBox>
  );
}
