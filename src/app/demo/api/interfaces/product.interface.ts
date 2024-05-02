import { IClient } from './client.interface';
import { IProductPart } from './product-part.interface';
import { IProductType } from './product-type.interface';

export interface IProduct {
  id: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  serial: string;
  reference: string;
  deliveryDate: Date;
  client: IClient;
  productType: IProductType;
  productPart: IProductPart[];
}
