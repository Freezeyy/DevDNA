import { Box, Avatar, Typography, Stack, Link, Chip } from '@mui/material';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import Panel from './Panel.jsx';
import { formatNumber, relativeYears } from '../utils/formatters.js';

/**
 * Profile overview: avatar, identity, bio, and follower stats.
 */
export default function ProfileCard({ profile, delay }) {
  const stats = [
    { label: 'Followers', value: formatNumber(profile.followers) },
    { label: 'Following', value: formatNumber(profile.following) },
    { label: 'Repos', value: formatNumber(profile.publicRepos) },
  ];

  return (
    <Panel delay={delay}>
      <Stack direction="row" spacing={2.4} alignItems="center">
        <Avatar
          src={profile.avatar}
          alt={profile.username}
          sx={{ width: 84, height: 84, border: '2px solid rgba(45,212,191,0.5)' }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" noWrap>
            {profile.name || profile.username}
          </Typography>
          <Link
            href={`https://github.com/${profile.username}`}
            target="_blank"
            rel="noreferrer"
            underline="hover"
            sx={{ color: 'primary.main', fontSize: '0.95rem' }}
          >
            @{profile.username}
          </Link>
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}>
            {relativeYears(profile.githubCreatedAt)}
          </Typography>
        </Box>
      </Stack>

      {profile.bio && (
        <Typography sx={{ mt: 2, color: 'text.secondary', fontSize: '0.95rem' }}>
          {profile.bio}
        </Typography>
      )}

      <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
        {profile.company && (
          <Chip
            size="small"
            icon={<BusinessRoundedIcon />}
            label={profile.company}
            variant="outlined"
          />
        )}
        {profile.location && (
          <Chip
            size="small"
            icon={<PlaceRoundedIcon />}
            label={profile.location}
            variant="outlined"
          />
        )}
      </Stack>

      <Stack direction="row" spacing={3} sx={{ mt: 2.6 }}>
        {stats.map((s) => (
          <Box key={s.label} sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontFamily: '"Space Grotesk", sans-serif' }} noWrap>
              {s.value}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {s.label}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Panel>
  );
}
