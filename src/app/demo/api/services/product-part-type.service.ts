import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { IProductPartType } from '../interfaces/product-part-type.interface';
@Injectable({
  providedIn: 'root',
})
export class ProductPartTypeService {
  constructor(private httpClient: HttpClient) {}

  private readonly URL = environment.apiUrl + '/product-part-type';

  public findAll(): Observable<IProductPartType[]> {
    return this.httpClient.get<IProductPartType[]>(this.URL);
  }

  public findOne(id: number): Observable<IProductPartType> {
    return this.httpClient.get<IProductPartType>(`${this.URL}/${id}`);
  }

  // public create(failureType: IFailureType): Observable<IFailureType> {
  //   return this.httpClient.post<IFailureType>(this.URL, failureType);
  // }

  // public update(
  //   id: number,
  //   failureType: IFailureType
  // ): Observable<IFailureType> {
  //   return this.httpClient.put<IFailureType>(`${this.URL}/${id}`, failureType);
  // }
}
