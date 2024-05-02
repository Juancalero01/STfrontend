import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { IProductPart } from '../interfaces/product-part.interface';
@Injectable({
  providedIn: 'root',
})
export class ProductPartService {
  constructor(private httpClient: HttpClient) {}

  private readonly URL = environment.apiUrl + '/product-part';

  public findAll(): Observable<IProductPart[]> {
    return this.httpClient.get<IProductPart[]>(this.URL);
  }

  public findOne(id: number): Observable<IProductPart> {
    return this.httpClient.get<IProductPart>(`${this.URL}/${id}`);
  }

  public findOneSerial(serial: string): Observable<IProductPart> {
    return this.httpClient.get<IProductPart>(`${this.URL}/s/${serial}`);
  }

  public create(productPart: IProductPart[]): Observable<IProductPart[]> {
    return this.httpClient.post<IProductPart[]>(this.URL, productPart);
  }
}
