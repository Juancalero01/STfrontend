import { Injectable } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}

  private readonly URL = environment.apiUrl + '/product';

  public findAll(): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(this.URL);
  }

  public findOne(id: number): Observable<IProduct> {
    return this.httpClient.get<IProduct>(`${this.URL}/${id}`);
  }

  public findOneSerial(serial: string) {
    return this.httpClient.get<IProduct>(`${this.URL}/s/${serial}`);
  }

  public create(product: IProduct): Observable<IProduct> {
    return this.httpClient.post<IProduct>(this.URL, product);
  }

  public update(id: number, product: IProduct): Observable<IProduct> {
    return this.httpClient.put<IProduct>(`${this.URL}/${id}`, product);
  }
}
