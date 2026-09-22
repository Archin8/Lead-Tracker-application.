import { useState, FormEvent } from 'react';
import { Paper, Box, TextField, Button, Alert, Typography } from '@mui/material';
import { NewLeadInput } from '../types/lead';

interface LeadFormProps {
  onCreate: (input: NewLeadInput) => Promise<void>;
}

export default function LeadForm({ onCreate }: LeadFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await onCreate({ name, email, phone });
      setName('');
      setEmail('');
      setPhone('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add New Lead
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { sm: 'center' },
        }}
      >
        <TextField
          label="Name"
          variant="outlined"
          size="small"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting}
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          size="small"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />
        <TextField
          label="Phone"
          variant="outlined"
          size="small"
          fullWidth
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={submitting}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          sx={{ minWidth: 120, height: 40, whiteSpace: 'nowrap' }}
        >
          {submitting ? 'Adding…' : 'Add Lead'}
        </Button>
      </Box>
    </Paper>
  );
}
