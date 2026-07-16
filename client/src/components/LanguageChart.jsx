import { Box, Typography, Stack } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Panel from './Panel.jsx';
import { CHART_COLORS } from '../utils/constants.js';

/**
 * Language breakdown as a donut chart with a compact legend.
 * Uses GitHub's language colors when available, else a fallback palette.
 */
export default function LanguageChart({ languageStats, delay }) {
  const top = languageStats.slice(0, 8);
  const data = top.map((l, i) => ({
    name: l.name,
    value: l.percentage,
    color: l.color || CHART_COLORS[i % CHART_COLORS.length],
  }));

  if (!data.length) {
    return (
      <Panel title="Languages" delay={delay}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No language data available.
        </Typography>
      </Panel>
    );
  }

  return (
    <Panel title="Most Used Languages" delay={delay}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: 180, height: 180, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={82}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{
                  background: 'rgba(12,18,32,0.96)',
                  border: '1px solid rgba(148,163,196,0.2)',
                  borderRadius: 12,
                }}
                labelStyle={{ color: '#eaf0ff' }}
                itemStyle={{ color: '#eaf0ff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Stack spacing={1} sx={{ flex: 1, width: '100%' }}>
          {data.map((l) => (
            <Box key={l.name} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: l.color, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ flex: 1 }} noWrap>
                {l.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                {l.value}%
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Panel>
  );
}
