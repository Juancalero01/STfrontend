import { Injectable } from '@angular/core';
import { IProductType } from '../interfaces/product-type.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductTypeService {
  constructor(private httpClient: HttpClient) {}

  private readonly URL = environment.apiUrl + '/product-type';

  public findAll(): Observable<IProductType[]> {
    return this.httpClient.get<IProductType[]>(this.URL);
  }

  public findOne(id: number): Observable<IProductType> {
    return this.httpClient.get<IProductType>(`${this.URL}/${id}`);
  }

  public create(productType: IProductType): Observable<IProductType> {
    return this.httpClient.post<IProductType>(this.URL, productType);
  }

  public update(
    id: number,
    productType: IProductType
  ): Observable<IProductType> {
    return this.httpClient.put<IProductType>(`${this.URL}/${id}`, productType);
  }
}
