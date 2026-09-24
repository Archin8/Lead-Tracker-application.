import express from 'express';
import cors from 'cors';
import leadsRouter from './routes/leads.js';
import { errorHandler, notFoundHandler } from './middlewares/error.js';
import { rateLimiter } from './middlewares/rateLimiter.js';

export function createApp() {
  const app = express();
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const corsEnv = process.env.CORS_ORIGIN;

    if (!corsEnv || corsEnv === '*' || corsEnv.trim() === '') {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    } else {
      const allowedOrigins = corsEnv.split(',').map((o) => o.trim());
      if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      } else {
        res.setHeader('Access-Control-Allow-Origin', origin || allowedOrigins[0]);
      }
    }

    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    next();
  });
  app.use(express.json());
  app.use(rateLimiter);
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/leads', leadsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}