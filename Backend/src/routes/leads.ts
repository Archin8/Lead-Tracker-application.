import { Router } from 'express';
import { listLeads, createLead, updateLeadStatus, getLead } from '../controllers/leadsController.js';

const router = Router();
router.get('/', listLeads);
router.get('/:id', getLead);
router.post('/', createLead);
router.patch('/:id/status', updateLeadStatus);

export default router;
