import { IFailureType } from './failure-type.interface';
import { IProduct } from './product.interface';
import { ISupportHistory } from './support-history.interface';
import { ISupportPriority } from './support-priority.interface';
import { ISupportState } from './support-state.interface';

export interface ISupport {
  id: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  reclaim: string;
  startReference: string | null;
  endReference: string | null;
  orderNumber: string | null;
  quoteNumber: string | null;
  failure: string | null;
  remarks: string | null;
  dateEntry: Date;
  dateDeparture: Date | null;
  warranty: boolean | null;
  securityTrap: boolean | null;
  bitrixUrl: string;
  product: IProduct;
  state: ISupportState;
  priority: ISupportPriority;
  failureTypes: IFailureType[];
  serviceHistory: ISupportHistory[];
}
