import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/pool.js';
import { createLeadSchema, updateStatusSchema, searchQuerySchema, Lead } from '../models/lead.js';

export async function listLeads(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = searchQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { q, status } = parsed.data;

    const conditions: string[] = [];
    const values: string[] = [];

    if (q) {
      values.push(`%${q}%`);
      conditions.push(`(name ILIKE $${values.length} OR email ILIKE $${values.length})`);
    }
    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query<Lead>(
      `SELECT id, name, email, phone, status, created_at FROM leads ${where} ORDER BY created_at DESC`,
      values,
    );
    res.json({ leads: result.rows });
  } catch (err) {
    next(err);
  }
}

export async function createLead(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createLeadSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { name, email, phone, status } = parsed.data;

    const result = await pool.query<Lead>(
      `INSERT INTO leads (name, email, phone, status) VALUES ($1, $2, $3, COALESCE($4, 'New'))
       RETURNING id, name, email, phone, status, created_at`,
      [name, email, phone, status ?? null],
    );
    res.status(201).json({ lead: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function updateLeadStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const { id } = req.params;
    const { status } = parsed.data;

    const result = await pool.query<Lead>(
      `UPDATE leads SET status = $1 WHERE id = $2 RETURNING id, name, email, phone, status, created_at`,
      [status, id],
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json({ lead: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function getLead(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await pool.query<Lead>(
      `SELECT id, name, email, phone, status, created_at FROM leads WHERE id = $1`,
      [id],
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json({ lead: result.rows[0] });
  } catch (err) {
    next(err);
  }
}
