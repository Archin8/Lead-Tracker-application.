import type { Lead, LeadStatus, NewLeadInput } from '../types/lead';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      body?.error?.fieldErrors
        ? Object.values(body.error.fieldErrors).flat().join(', ')
        : body?.error ?? `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return res.json();
}

export async function fetchLeads(params?: { q?: string; status?: string }): Promise<Lead[]> {
  const query = new URLSearchParams();
  if (params?.q) query.set('q', params.q);
  if (params?.status) query.set('status', params.status);

  const res = await fetch(`${API_URL}/api/leads?${query.toString()}`);
  const data = await handleResponse<{ leads: Lead[] }>(res);
  return data.leads;
}

export async function createLead(input: NewLeadInput): Promise<Lead> {
  const res = await fetch(`${API_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await handleResponse<{ lead: Lead }>(res);
  return data.lead;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  const res = await fetch(`${API_URL}/api/leads/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await handleResponse<{ lead: Lead }>(res);
  return data.lead;
}
