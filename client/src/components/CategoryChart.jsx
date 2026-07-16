import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Panel from './Panel.jsx';
import { CHART_COLORS } from '../utils/constants.js';

const MotionBox = motion(Box);

/**
 * Project categories inferred from repo names/descriptions/topics.
 * Rendered as clean labeled progress bars rather than a cramped chart,
 * which reads much better for a small number of categories.
 */
export default function CategoryChart({ categories, delay }) {
  const data = (categories || []).slice(0, 7);

  if (!data.length) {
    return (
      <Panel title="Project Categories" delay={delay}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No categories detected.
        </Typography>
      </Panel>
    );
  }

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <Panel title="Project Categories" delay={delay}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.map((item, i) => {
          const color = CHART_COLORS[i % CHART_COLORS.length];
          const pct = (item.count / max) * 100;
          return (
            <Box key={item.name}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.7 }}>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  {item.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}
                >
                  {item.count}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  height: 8,
                  borderRadius: 999,
                  bgcolor: 'rgba(148,163,196,0.1)',
                  overflow: 'hidden',
                }}
              >
                <MotionBox
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: (delay || 0) + i * 0.08, ease: 'easeOut' }}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${color}99, ${color})`,
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Panel>
  );
}
