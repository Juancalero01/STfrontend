import { IProduct } from './product.interface';
import { ISupportPriority } from './support-priority.interface';
import { ISupportState } from './support-state.interface';

export interface ISupport {
  reclaim: string;
  failure: string | null;
  reference: string | null;
  remarks: string | null;
  dateEntry: Date;
  warranty: boolean | null;
  product: IProduct;
  state: ISupportState;
  priority: ISupportPriority;
}
