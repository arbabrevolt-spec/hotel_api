import type { Request, Response } from 'express';
import type { AuthService } from './auth.service';
import { sendResponse } from '../../lib/response';

export class AuthController {
  constructor(private readonly authService: AuthService) { }

  signup = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.signup(req.validated!.body);
    sendResponse(res, true, { data: result, message: 'Signed up' }, 201);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.login(req.validated!.body);
    sendResponse(res, true, { data: result, message: 'Logged in' });
  };

  // JWT is stateless — logout is client-side only (discard the token)
  logout = (_req: Request, res: Response): void => {
    sendResponse(res, true, { message: 'Logged out successfully' });
  };
}
