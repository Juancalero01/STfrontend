import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ISupportState } from '../interfaces/support-state.interface';

@Injectable({
  providedIn: 'root',
})
export class SupportStateService {
  constructor(private httpClient: HttpClient) {}

  private readonly URL = environment.apiUrl + '/service-state';

  public findAll(): Observable<ISupportState[]> {
    return this.httpClient.get<ISupportState[]>(this.URL);
  }

  public findOne(id: number): Observable<ISupportState> {
    return this.httpClient.get<ISupportState>(`${this.URL}/${id}`);
  }
}
