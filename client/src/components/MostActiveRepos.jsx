import { Box, Typography } from '@mui/material';
import Panel from './Panel.jsx';
import RepoCard from './RepoCard.jsx';

/**
 * Grid of the developer's most active / highest-impact repositories.
 */
export default function MostActiveRepos({ repos, delay }) {
  if (!repos?.length) return null;

  return (
    <Panel title="Most Active Repositories" delay={delay}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
          gap: 1.6,
        }}
      >
        {repos.map((repo, i) => (
          <RepoCard key={repo.name} repo={repo} index={i} />
        ))}
      </Box>
      {repos.length === 0 && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No repositories found.
        </Typography>
      )}
    </Panel>
  );
}
