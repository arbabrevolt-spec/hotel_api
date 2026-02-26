import type { Knex } from 'knex';
import type { User, UserRole } from './user.types';

export class UserRepo {
  constructor(private readonly db: Knex) { }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.db<User>('users').where({ email }).first();
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.db<User>('users').where({ username }).first();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.db<User>('users').where({ id }).first();
  }

  async create(data: { username: string; email: string; password_hash: string; role: UserRole }): Promise<User> {
    const [user] = await this.db<User>('users').insert(data).returning('*');
    return user;
  }
}
