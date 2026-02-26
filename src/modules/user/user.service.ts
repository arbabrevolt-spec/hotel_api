import type { UserRepo } from './user.repo';
import type { NonSensitiveUser } from './user.types';

export class UserService {
    constructor(private readonly userRepo: UserRepo) { }

    /**
     * Return all users but only expose non-sensitive columns (no email or password).
     */
    async getAllUsers(): Promise<NonSensitiveUser[]> {
        const users = await this.userRepo.findAll();
        return users.map(({ id, username, email, role, created_at }) => ({ id, username, role, email, created_at }));
    }
}
