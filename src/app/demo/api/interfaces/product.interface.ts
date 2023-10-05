import { IClient } from './client.interface';
import { IProductType } from './product-type.interface';

export interface IProduct {
  id: number;
  state?: boolean;
  createdAt?: string;
  updatedAt?: string;
  serial: string;
  reference?: string | null;
  deliveryDate: Date;
  client: IClient;
  productType: IProductType;
}
