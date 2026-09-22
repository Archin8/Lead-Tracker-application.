import express from 'express';
import cors from 'cors';
import leadsRouter from './routes/leads.js';
import { errorHandler, notFoundHandler } from './middlewares/error.js';
import { rateLimiter } from './middlewares/rateLimiter.js';
export function createApp() {
    const app = express();
    app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }));
    app.use(express.json());
    app.use(rateLimiter);
    app.get('/health', (_req, res) => res.json({ status: 'ok' }));
    app.use('/api/leads', leadsRouter);
    app.use(notFoundHandler);
    app.use(errorHandler);
    return app;
}
