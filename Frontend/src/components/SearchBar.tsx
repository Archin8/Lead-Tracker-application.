import { useState, useEffect } from 'react';
import {
  Paper,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { LEAD_STATUSES, LeadStatus } from '../types/lead';

interface SearchBarProps {
  onSearch: (q: string, status: LeadStatus | '') => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<LeadStatus | ''>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(q, status);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [q, status, onSearch]);

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack direction="row" gap={2} flexWrap="wrap">
        <TextField
          placeholder="Search leads by name, email, or phone…"
          variant="outlined"
          size="small"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter-select"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as LeadStatus | '')}
          >
            <MenuItem value="">All statuses</MenuItem>
            {LEAD_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}
