import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ISupportHistory } from '../interfaces/support-history.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupportHistoryService {
  constructor(private httpClient: HttpClient) {}
  private readonly URL = environment.apiUrl + '/service-history';

  public findAll(): Observable<ISupportHistory[]> {
    return this.httpClient.get<ISupportHistory[]>(this.URL);
  }

  public findOne(id: number): Observable<ISupportHistory> {
    return this.httpClient.get<ISupportHistory>(`${this.URL}/${id}`);
  }

  public findByService(id: number): Observable<ISupportHistory[]> {
    return this.httpClient.get<ISupportHistory[]>(`${this.URL}/s/${id}`);
  }

  public findLastHistory(id: number): Observable<ISupportHistory> {
    return this.httpClient.get<ISupportHistory>(`${this.URL}/r/${id}`);
  }

  public create(supportHistory: ISupportHistory): Observable<ISupportHistory> {
    return this.httpClient.post<ISupportHistory>(this.URL, supportHistory);
  }

  public update(
    id: number,
    supportHistory: ISupportHistory
  ): Observable<ISupportHistory> {
    return this.httpClient.put<ISupportHistory>(
      `${this.URL}/${id}`,
      supportHistory
    );
  }
}
