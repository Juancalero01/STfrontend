import { IRole } from './role.interface';

export interface IUser {
  id: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  fullname: string;
  username: string;
  email: string;
  password?: string;
  role: IRole;
}
