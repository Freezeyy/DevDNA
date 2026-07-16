import { Typography } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Panel from './Panel.jsx';

/**
 * Repository growth over time (new public repos created per year).
 */
export default function GrowthTimeline({ timeline, delay }) {
  if (!timeline?.length) {
    return (
      <Panel title="Repository Growth" delay={delay}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Not enough data to build a timeline.
        </Typography>
      </Panel>
    );
  }

  return (
    <Panel title="Repository Growth Timeline" delay={delay}>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={timeline} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="growthArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,196,0.12)" />
          <XAxis
            dataKey="year"
            tick={{ fill: '#94a3c4', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3c4', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ stroke: 'rgba(45,212,191,0.4)', strokeWidth: 1 }}
            contentStyle={{
              background: 'rgba(12,18,32,0.96)',
              border: '1px solid rgba(148,163,196,0.2)',
              borderRadius: 12,
            }}
            labelStyle={{ color: '#eaf0ff', fontWeight: 600, marginBottom: 4 }}
            itemStyle={{ color: '#2dd4bf' }}
            formatter={(value) => [`${value} repos`, 'Created']}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#2dd4bf"
            strokeWidth={2.4}
            fill="url(#growthArea)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Panel>
  );
}
