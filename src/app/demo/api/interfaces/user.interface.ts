import { IRole } from './role.interface';

export interface IUser {
  id: number;
  fullname: string;
  username?: string;
  email?: string;
  password?: string;
  role: IRole;
  isActive?: boolean;
}
