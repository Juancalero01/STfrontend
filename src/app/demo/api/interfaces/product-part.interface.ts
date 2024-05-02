import { IProductPartType } from './product-part-type.interface';
import { IProduct } from './product.interface';

export interface IProductPart {
  id: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  serial: string | null;
  product: IProduct;
  productPartType: IProductPartType;
}
