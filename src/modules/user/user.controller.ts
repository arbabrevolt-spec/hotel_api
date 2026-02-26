import type { Request, Response } from 'express';
import type { UserService } from './user.service';
import { sendResponse } from '../../lib/response';

export class UserController {
    constructor(private readonly userService: UserService) { }

    getAllUsers = async (_req: Request, res: Response): Promise<void> => {
        const users = await this.userService.getAllUsers();
        sendResponse(res, true, { data: users });
    };
}
