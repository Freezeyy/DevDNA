import { Box, Typography } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import CallSplitRoundedIcon from '@mui/icons-material/CallSplitRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { motion } from 'framer-motion';
import Panel from './Panel.jsx';
import { formatNumber } from '../utils/formatters.js';

const MotionBox = motion(Box);

/**
 * Repository statistics: totals for repos, stars, forks, and active repos.
 */
export default function StatsGrid({ metrics, delay }) {
  const items = [
    { label: 'Repositories', value: formatNumber(metrics.totalRepos), icon: FolderRoundedIcon, color: '#60a5fa' },
    { label: 'Total Stars', value: formatNumber(metrics.totalStars), icon: StarRoundedIcon, color: '#fbbf24' },
    { label: 'Total Forks', value: formatNumber(metrics.totalForks), icon: CallSplitRoundedIcon, color: '#f97362' },
    { label: 'Active (1y)', value: formatNumber(metrics.activeRepos), icon: BoltRoundedIcon, color: '#4ade80' },
  ];

  return (
    <Panel title="Repository Statistics" delay={delay}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1.6,
        }}
      >
        {items.map((item, i) => (
          <MotionBox
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: (delay || 0) + i * 0.08 }}
            whileHover={{ y: -3 }}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(148,163,196,0.06)',
              border: '1px solid rgba(148,163,196,0.12)',
              transition: 'border-color 0.2s ease',
              '&:hover': { borderColor: 'rgba(45,212,191,0.35)' },
            }}
          >
            <item.icon sx={{ color: item.color, fontSize: 24 }} />
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: '1.7rem',
                lineHeight: 1.1,
                mt: 0.5,
              }}
            >
              {item.value}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {item.label}
            </Typography>
          </MotionBox>
        ))}
      </Box>
    </Panel>
  );
}
