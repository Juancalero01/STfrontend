import { Injectable } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';
import { PRODUCTS } from '../data/product.data';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  findAll(): IProduct[] {
    return PRODUCTS;
  }
}
