export function errorHandler(err, _req, res, _next) {
    console.error(err);
    if (err.code === '23505') {
        return res.status(409).json({ error: 'A lead with this email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
}
export function notFoundHandler(_req, res) {
    res.status(404).json({ error: 'Route not found' });
}
