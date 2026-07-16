import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Button, Chip, Tooltip } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { motion } from 'framer-motion';

import BrandMark from '../components/BrandMark.jsx';
import SearchBar from '../components/SearchBar.jsx';
import AuroraBackground from '../components/AuroraBackground.jsx';
import StatusView from '../components/StatusView.jsx';
import ProfileCard from '../components/ProfileCard.jsx';
import ScoreCard from '../components/ScoreCard.jsx';
import StatsGrid from '../components/StatsGrid.jsx';
import LanguageChart from '../components/LanguageChart.jsx';
import GrowthTimeline from '../components/GrowthTimeline.jsx';
import CategoryChart from '../components/CategoryChart.jsx';
import MostActiveRepos from '../components/MostActiveRepos.jsx';
import InsightsPanel from '../components/InsightsPanel.jsx';
import useAnalyze from '../hooks/useAnalyze.js';
import { formatDate } from '../utils/formatters.js';

export default function DashboardPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, run } = useAnalyze();

  // Fetch whenever the username in the URL changes.
  useEffect(() => {
    run(username);
  }, [username, run]);

  const handleSearch = (name) => navigate(`/u/${encodeURIComponent(name)}`);

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, position: 'relative' }}>
      <AuroraBackground />
      <Container maxWidth="lg" sx={{ pt: 3, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <BrandMark size="sm" />
          </Box>
          <Box sx={{ flex: 1, maxWidth: 460, ml: { md: 'auto' } }}>
            <SearchBar onSubmit={handleSearch} loading={loading} defaultValue={username} />
          </Box>
        </Stack>

        {(loading || error) && (
          <StatusView
            loading={loading}
            error={error}
            username={username}
            onRetry={() => run(username, true)}
            onHome={() => navigate('/')}
          />
        )}

        {data && !loading && !error && (
          <>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              justifyContent="flex-end"
              sx={{ mb: 2 }}
            >
              <Chip
                size="small"
                variant="outlined"
                label={`Generated ${formatDate(data.analytics.generatedAt)}`}
              />
              {data.cached && (
                <Chip size="small" color="primary" variant="outlined" label="Cached" />
              )}
              <Tooltip title="Re-fetch fresh data from GitHub">
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  startIcon={<RefreshRoundedIcon />}
                  onClick={() => run(username, true)}
                >
                  Refresh
                </Button>
              </Tooltip>
            </Stack>

            {/* Responsive dashboard grid */}
            <Box
              component={motion.div}
              initial="hidden"
              animate="visible"
              sx={{
                display: 'grid',
                gap: 2.4,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
              }}
            >
              <Box sx={{ gridColumn: { xs: '1', md: 'span 5' } }}>
                <ProfileCard profile={data.profile} delay={0} />
              </Box>
              <Box sx={{ gridColumn: { xs: '1', md: 'span 3' } }}>
                <ScoreCard score={data.analytics.score} delay={0.05} />
              </Box>
              <Box sx={{ gridColumn: { xs: '1', md: 'span 4' } }}>
                <StatsGrid metrics={data.analytics.metrics} delay={0.1} />
              </Box>

              <Box sx={{ gridColumn: { xs: '1', md: 'span 5' } }}>
                <LanguageChart languageStats={data.analytics.languageStats} delay={0.15} />
              </Box>
              <Box sx={{ gridColumn: { xs: '1', md: 'span 7' } }}>
                <GrowthTimeline timeline={data.analytics.metrics.growthTimeline} delay={0.2} />
              </Box>

              <Box sx={{ gridColumn: { xs: '1', md: 'span 5' } }}>
                <CategoryChart categories={data.analytics.metrics.projectCategories} delay={0.25} />
              </Box>
              <Box sx={{ gridColumn: { xs: '1', md: 'span 7' } }}>
                <InsightsPanel insights={data.analytics.insights} delay={0.3} />
              </Box>

              <Box sx={{ gridColumn: { xs: '1', md: 'span 12' } }}>
                <MostActiveRepos repos={data.analytics.metrics.mostActive} delay={0.35} />
              </Box>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
