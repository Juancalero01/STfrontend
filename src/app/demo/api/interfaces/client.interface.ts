import { IProvince } from './province.interface';
import { ITaxCondition } from './tax-condition.interface';

export interface IClient {
  id: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  taxpayerName: string;
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
