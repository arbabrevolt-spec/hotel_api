import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { UserRepo } from '../user/user.repo';
import type { SignupInput, LoginInput } from './auth.schema';
import type { PublicUser, UserRole } from '../user/user.types';
import { ConflictError, UnauthorizedError } from '../../lib/AppError';

const SALT_ROUNDS = 10;

export class AuthService {
  constructor(private readonly userRepo: UserRepo) { }

  async signup(input: SignupInput): Promise<{ user: PublicUser; token: string }> {
    const existingEmail = await this.userRepo.findByEmail(input.email);
    if (existingEmail) throw new ConflictError('Email already in use');

    const existingUsername = await this.userRepo.findByUsername(input.username);
    if (existingUsername) throw new ConflictError('Username already in use');

    const role: UserRole =
      input.adminSecret && input.adminSecret === process.env.ADMIN_SECRET ? 'admin' : 'user';

    const password_hash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await this.userRepo.create({ username: input.username, email: input.email, password_hash, role });

    const token = this.signToken(user.id, user.role);
    const { password_hash: _, ...publicUser } = user;

    return { user: publicUser, token };
  }

  async login(input: LoginInput): Promise<{ user: PublicUser; token: string }> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) throw new UnauthorizedError('Invalid email or password');

    const valid = await bcrypt.compare(input.password, user.password_hash);
    if (!valid) throw new UnauthorizedError('Invalid email or password');

    const token = this.signToken(user.id, user.role);
    const { password_hash: _, ...publicUser } = user;

    return { user: publicUser, token };
  }

  private signToken(userId: string, role: UserRole): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not set');

    return jwt.sign({ sub: userId, role }, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    } as jwt.SignOptions);
  }
}
