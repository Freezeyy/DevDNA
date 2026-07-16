import { useState } from 'react';
import { Paper, InputBase, Button, Box } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

/**
 * Username search input. This is a genuine user interaction container,
 * so it is allowed to be a card-like surface.
 */
export default function SearchBar({ onSubmit, loading, defaultValue = '', autoFocus = false }) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 0.8,
        pl: 2.2,
        width: '100%',
        maxWidth: 560,
        borderRadius: 999,
        bgcolor: 'rgba(12, 18, 32, 0.75)',
        borderColor: 'rgba(45, 212, 191, 0.35)',
      }}
    >
      <SearchRoundedIcon sx={{ color: 'text.secondary' }} />
      <InputBase
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter a GitHub username…"
        sx={{ flex: 1, fontSize: '1.05rem', color: 'text.primary' }}
        inputProps={{ 'aria-label': 'GitHub username' }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading || !value.trim()}
        sx={{ borderRadius: 999, py: 1.1, px: 3 }}
      >
        <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
          {loading ? 'Decoding…' : 'Analyze'}
        </Box>
      </Button>
    </Paper>
  );
}
