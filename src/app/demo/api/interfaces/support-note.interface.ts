import { ISupportHistory } from './support-history.interface';
import { ISupportState } from './support-state.interface';
import { IUser } from './user.interface';

export interface ISupportNote {
  id: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  dateEntry: Date;
  state: ISupportState;
  serviceHistory: ISupportHistory;
  user: IUser;
  comment: string;
}
