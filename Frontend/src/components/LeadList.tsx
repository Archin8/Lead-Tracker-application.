import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
} from '@mui/material';
import StatusChip from './StatusChip';
import { Lead, LEAD_STATUSES, LeadStatus } from '../types/lead';

interface LeadListProps {
  leads: Lead[];
  loading: boolean;
  onStatusChange: (id: string, status: LeadStatus) => void;
}

export default function LeadList({ leads, loading, onStatusChange }: LeadListProps) {
  if (loading) {
    return (
      <Paper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 6 }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (leads.length === 0) {
    return (
      <Paper sx={{ textAlign: 'center', py: 6, px: 2 }}>
        <Typography color="text.secondary">No leads found.</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="leads table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Update Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} hover>
              <TableCell sx={{ fontWeight: 500 }}>{lead.name}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.phone}</TableCell>
              <TableCell>
                <StatusChip status={lead.status} />
              </TableCell>
              <TableCell>
                {new Date(lead.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Select
                  size="small"
                  value={lead.status}
                  onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
                  sx={{ minWidth: 130 }}
                >
                  {LEAD_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
