import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ISupportPriority } from '../interfaces/support-priority.interface';

@Injectable({
  providedIn: 'root',
})
export class SupportPriorityService {
  constructor(private httpClient: HttpClient) {}

  private readonly URL = environment.apiUrl + '/service-priority';

  public findAll(): Observable<ISupportPriority[]> {
    return this.httpClient.get<ISupportPriority[]>(this.URL);
  }

  public findOne(id: number): Observable<ISupportPriority> {
    return this.httpClient.get<ISupportPriority>(`${this.URL}/${id}`);
  }
}
