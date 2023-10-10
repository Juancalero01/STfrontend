import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { IFailureType } from '../interfaces/failure-type.interface';
@Injectable({
  providedIn: 'root',
})
export class FailureTypeService {
  constructor(private httpClient: HttpClient) {}

  private readonly URL = environment.apiUrl + '/failure-type';

  public findAll(): Observable<IFailureType[]> {
    return this.httpClient.get<IFailureType[]>(this.URL);
  }

  public findOne(id: number): Observable<IFailureType> {
    return this.httpClient.get<IFailureType>(`${this.URL}/${id}`);
  }

  public create(failureType: IFailureType): Observable<IFailureType> {
    return this.httpClient.post<IFailureType>(this.URL, failureType);
  }

  public update(
    id: number,
    failureType: IFailureType
  ): Observable<IFailureType> {
    return this.httpClient.put<IFailureType>(`${this.URL}/${id}`, failureType);
  }
}
