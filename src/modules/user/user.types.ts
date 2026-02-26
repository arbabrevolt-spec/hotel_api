export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
}

export type PublicUser = Omit<User, 'password_hash'>;
