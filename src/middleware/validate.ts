import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { sendResponse } from '../lib/response';

/**
 * validate(schema) — Zod validation middleware factory.
 *
 * Pass a Zod object schema with optional keys: body, params, query.
 * Validated data is stored in req.validated for type-safe access in controllers.
 *
 * Returns 400 with a field-level error array on failure.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.slice(1).join('.'), // strip leading "body" / "params" / "query"
        message: e.message,
      }));
      sendResponse(res, false, { error: 'Validation failed', data: errors }, 400);
      return;
    }

    // Store validated data in req.validated for type-safe access
    req.validated = {
      body: result.data.body,
      params: result.data.params,
      query: result.data.query,
    };

    next();
  };
}
