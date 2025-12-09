export type Role = 'USER' | 'ADMIN';
export type User = {
  email: string;
  password: string;
  name: string;
  surname: string;
  role?: Role;
};
