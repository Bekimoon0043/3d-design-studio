import { Router } from 'express';

const router = Router();

/**
 * GET /api/health
 * Used by Render (and any uptime monitor) to verify the service is alive.
 */
router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: '3d-design-platform-backend',
    timestamp: new Date().toISOString(),
  });
});

export default router;
