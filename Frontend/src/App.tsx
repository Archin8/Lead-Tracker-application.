import { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Stack,
  Box,
} from '@mui/material';
import { fetchLeads, createLead, updateLeadStatus } from './api/leadsApi';
import type { Lead, LeadStatus, NewLeadInput } from './types/lead';
import LeadForm from './components/LeadForm';
import SearchBar from './components/SearchBar';
import LeadList from './components/LeadList';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [q, setQ] = useState<string>('');
  const [status, setStatus] = useState<LeadStatus | ''>('');

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLeads({ q, status });
      setLeads(data);
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  }, [q, status]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleCreate = async (input: NewLeadInput) => {
    await createLead(input);
    await loadLeads();
  };

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    const updatedLead = await updateLeadStatus(id, newStatus);
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? updatedLead : lead))
    );
  };

  const handleSearch = useCallback((newQ: string, newStatus: LeadStatus | '') => {
    setQ(newQ);
    setStatus(newStatus);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            Lead Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <LeadForm onCreate={handleCreate} />
          <SearchBar onSearch={handleSearch} />
          <LeadList
            leads={leads}
            loading={loading}
            onStatusChange={handleStatusChange}
          />
        </Stack>
      </Container>
    </Box>
  );
}
