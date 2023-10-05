import { Injectable } from '@angular/core';
import { IProductType } from '../interfaces/product-type.interface';
import { PRODUCT_TYPES } from '../data/product-type';

@Injectable({
  providedIn: 'root',
})
export class ProductTypeService {
  constructor() {}

  findAll(): IProductType[] {
    return PRODUCT_TYPES;
  }
}
