import { ISupportNote } from './support-note.interface';
import { ISupportState } from './support-state.interface';
import { ISupport } from './support.interface';
import { IUser } from './user.interface';

export interface ISupportHistory {
  id: number;
  stateCurrent: ISupportState;
  stateNext: ISupportState;
  remarks: string;
  service: ISupport;
  user: number;
  dateEntry: Date;
  serviceNote: ISupportNote[];
}

export interface ISupportHistoryMany {
  stateCurrent?: ISupportState;
  stateNext?: ISupportState;
  remarks: string;
  service: ISupport;
  user: number;
  dateEntry: Date;
}
