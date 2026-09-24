import express from 'express';
import cors from 'cors';
import leadsRouter from './routes/leads.js';
import { errorHandler, notFoundHandler } from './middlewares/error.js';
import { rateLimiter } from './middlewares/rateLimiter.js';
export function createApp() {
    const app = express();
    const allowedOrigins = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
        : '*';
    app.use(cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    app.use(express.json());
    app.use(rateLimiter);
    app.get('/health', (_req, res) => res.json({ status: 'ok' }));
    app.use('/api/leads', leadsRouter);
    app.use(notFoundHandler);
    app.use(errorHandler);
    return app;
}
