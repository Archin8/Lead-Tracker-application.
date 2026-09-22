import { z } from 'zod';
export const LEAD_STATUSES = [
    'New',
    'Contacted',
    'Qualified',
    'Converted',
    'Lost',
];
export const createLeadSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(255),
    email: z.string().trim().email('A valid email is required').max(255),
    phone: z.string().trim().min(7, 'Phone number looks too short').max(50),
    status: z.enum(LEAD_STATUSES).optional(),
});
export const updateStatusSchema = z.object({
    status: z.enum(LEAD_STATUSES, {
        error: `Status must be one of: ${LEAD_STATUSES.join(', ')}`,
    }),
});
export const searchQuerySchema = z.object({
    q: z.string().trim().max(255).optional(),
    status: z.enum(LEAD_STATUSES).optional(),
});
