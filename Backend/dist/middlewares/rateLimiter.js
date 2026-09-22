// In-memory variable storing IP request counts and window reset timestamps
const requestStore = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15-minute window
const MAX_REQUESTS = 100; // Max requests allowed per window per IP
export function rateLimiter(req, res, next) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown_client';
    const now = Date.now();
    const record = requestStore.get(ip);
    if (!record || now > record.resetTime) {
        // Initialize or reset window for this IP
        requestStore.set(ip, {
            count: 1,
            resetTime: now + WINDOW_MS,
        });
        return next();
    }
    if (record.count >= MAX_REQUESTS) {
        return res.status(429).json({
            error: 'Too many requests, please try again later.',
        });
    }
    record.count += 1;
    next();
}
// Cleanup stale entries every 60 seconds to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of requestStore.entries()) {
        if (now > record.resetTime) {
            requestStore.delete(ip);
        }
    }
}, 60 * 1000);
