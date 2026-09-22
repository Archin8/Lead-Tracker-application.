import { Request, Response, NextFunction } from 'express';

interface PgError extends Error { code?: string; }

export function errorHandler(err: PgError, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  if (err.code === '23505') {
    return res.status(409).json({ error: 'A lead with this email already exists' });
  }
  res.status(500).json({ error: 'Internal server error' });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: 'Route not found' });
}