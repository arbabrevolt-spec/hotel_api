import type { Request, Response, NextFunction } from 'express';
import type { UserRole } from '../modules/user/user.types';
import { ForbiddenError } from '../lib/AppError';

/**
 * requireRole('admin') — must be composed after authenticate.
 * Throws ForbiddenError if the user's role is not in the allowed list.
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
}
