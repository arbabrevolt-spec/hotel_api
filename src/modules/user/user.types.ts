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
// Fields safe to expose publicly.  *Do not include email or password_hash.*
export type NonSensitiveUser = Pick<User, 'id' | 'username' | 'role' | 'created_at'>;
