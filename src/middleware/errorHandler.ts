import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/AppError';
import logger from '../lib/logger';
import { sendResponse } from '../lib/response';

/**
 * Central error handler — registered last in app.ts.
 *
 * - Known AppError subclasses  → structured JSON response + warn log
 * - Unknown errors             → 500 + full stack error log (never leaked to client)
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction, // required 4-arg signature for Express to recognise as error handler
): void {
  if (err instanceof AppError) {
    logger.warn(`[${err.code}] ${req.method} ${req.path} → ${err.statusCode}: ${err.message}`);
    sendResponse(res, false, { error: { code: err.code, message: err.message } }, err.statusCode);
    return;
  }

  logger.error(`Unhandled error on ${req.method} ${req.path}`, {
    message: err.message,
    stack: err.stack,
  });

  sendResponse(res, false, { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } }, 500);
}
