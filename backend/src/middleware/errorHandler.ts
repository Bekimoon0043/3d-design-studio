import { NextFunction, Request, Response } from 'express';

/** Central error handler so route handlers can just `throw` or call `next(err)`. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // eslint-disable-next-line no-console
  console.error('[API Error]', err);

  const message = err instanceof Error ? err.message : 'Internal server error';
  const status = (err as { status?: number })?.status ?? 500;

  res.status(status).json({ error: message });
}

/** 404 handler for unmatched routes. */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}
