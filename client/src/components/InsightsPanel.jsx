import { Box, Typography, Stack, Chip } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import Panel from './Panel.jsx';

/**
 * AI insights: narrative summary, highlights, and recommendations.
 * Works with both OpenAI and the rule-based fallback payload.
 */
export default function InsightsPanel({ insights, delay }) {
  if (!insights) return null;

  const { summary, highlights = [], recommendations = [], source } = insights;

  return (
    <Panel
      title="AI Insights"
      delay={delay}
      action={
        <Chip
          size="small"
          icon={<AutoAwesomeRoundedIcon />}
          label={source === 'gemini' ? 'Gemini' : 'Analytics'}
          sx={{ bgcolor: 'rgba(45,212,191,0.14)', color: 'primary.main', border: '1px solid rgba(45,212,191,0.3)' }}
        />
      }
    >
      {summary && (
        <Typography sx={{ color: 'text.primary', fontSize: '1rem', lineHeight: 1.6, mb: 2.4 }}>
          {summary}
        </Typography>
      )}

      {highlights.length > 0 && (
        <Box sx={{ mb: 2.4 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Highlights
          </Typography>
          <Stack spacing={1.2} sx={{ mt: 1 }}>
            {highlights.map((h, i) => (
              <Stack key={i} direction="row" spacing={1.2} alignItems="flex-start">
                <CheckCircleRoundedIcon sx={{ fontSize: 18, color: 'success.main', mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {h}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}

      {recommendations.length > 0 && (
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Recommendations
          </Typography>
          <Stack spacing={1.2} sx={{ mt: 1 }}>
            {recommendations.map((r, i) => (
              <Stack key={i} direction="row" spacing={1.2} alignItems="flex-start">
                <LightbulbRoundedIcon sx={{ fontSize: 18, color: 'warning.main', mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {r}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
    </Panel>
  );
}
