import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { animate } from 'framer-motion';
import Panel from './Panel.jsx';
import { scoreLabel } from '../utils/constants.js';

/**
 * Developer activity score rendered as a radial gauge with an animated
 * count-up value in the center and a soft glow behind it.
 */
export default function ScoreCard({ score, delay }) {
  const data = [{ name: 'score', value: score, fill: 'url(#scoreGradient)' }];
  const [display, setDisplay] = useState(0);

  // Smoothly count the number up from 0 to the final score.
  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1.1,
      delay: (delay || 0) + 0.15,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [score, delay]);

  return (
    <Panel title="Developer Score" delay={delay}>
      <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
        {/* Soft glow behind the gauge center */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              width: 130,
              height: 130,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(45,212,191,0.35), transparent 70%)',
              filter: 'blur(14px)',
            }}
          />
        </Box>

        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="72%"
            outerRadius="100%"
            data={data}
            startAngle={220}
            endAngle={-40}
          >
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background={{ fill: 'rgba(148,163,196,0.14)' }} dataKey="value" cornerRadius={999} />
          </RadialBarChart>
        </ResponsiveContainer>

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: '3.2rem',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {Math.round(display)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            out of 100
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              color: 'primary.main',
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 600,
            }}
          >
            {scoreLabel(score)}
          </Typography>
        </Box>
      </Box>
    </Panel>
  );
}
