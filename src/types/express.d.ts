import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      /**
       * Validated request data populated by the validate middleware.
       * Contains safely parsed and validated body, params, and/or query.
       */
      validated?: {
        body?: any;
        params?: any;
        query?: any;
      };
    }
  }
}
