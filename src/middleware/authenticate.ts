import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { UserRole } from '../modules/user/user.types';
import { UnauthorizedError } from '../lib/AppError';

interface JwtPayload {
  sub: string;
  role: UserRole;
}

// Augment Express's Request type globally so req.user is typed everywhere
declare global {
  namespace Express {
    interface Request {
      user: { id: string; role: UserRole };
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid Authorization header'));
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(new Error('JWT_SECRET is not set'));
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}
