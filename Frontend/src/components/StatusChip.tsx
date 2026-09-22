import { Chip } from '@mui/material';
import { LeadStatus } from '../types/lead';

const COLORS: Record<LeadStatus, string> = {
  New: '#03b7d3',
  Contacted: '#f59e0b',
  Qualified: '#8b5cf6',
  Converted: '#10b981',
  Lost: '#ef4444',
};

export default function StatusChip({ status }: { status: LeadStatus }) {
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: `${COLORS[status]}1a`,
        color: COLORS[status],
        fontWeight: 600,
      }}
    />
  );
}
