import { IFailureType } from './failure-type.interface';
import { IProduct } from './product.interface';
import { ISupportPriority } from './support-priority.interface';
import { ISupportState } from './support-state.interface';

export interface ISupport {
  id: number;
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
  product: IProduct;
  state: ISupportState;
  priority: ISupportPriority;
  failureTypes: IFailureType[];
}
