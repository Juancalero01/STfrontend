import { IProvince } from './province.interface';
import { ITaxCondition } from './tax-condition.interface';

export interface IClient {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  taxpayerName: string | null;
  taxpayerId?: string | null;
  taxpayerEmail?: string | null;
  taxpayerPhone?: string | null;
  street?: string | null;
  number?: string | null;
  floor?: string | null;
  office?: string | null;
  postalCode?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  comment?: string | null;
  taxCondition?: ITaxCondition | null;
  province?: IProvince | null;
}
