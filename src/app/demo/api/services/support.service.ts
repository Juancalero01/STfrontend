import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { ISupport } from '../interfaces/support.interface';
import { ISupportState } from '../interfaces/support-state.interface';

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  constructor(private httpClient: HttpClient) {}

  private readonly URL = environment.apiUrl + '/service';

  public findAll(): Observable<ISupport[]> {
    return this.httpClient.get<ISupport[]>(this.URL);
  }

  public findOne(id: number): Observable<ISupport> {
    return this.httpClient.get<ISupport>(`${this.URL}/${id}`);
  }

  public findLastReclaim(): Observable<string> {
    return this.httpClient.get<string>(`${this.URL}/r`);
  }

  public create(support: ISupport): Observable<ISupport> {
    return this.httpClient.post<ISupport>(this.URL, support);
  }

  public update(id: number, support: ISupport): Observable<ISupport> {
    return this.httpClient.put<ISupport>(`${this.URL}/${id}`, support);
  }

  public updateState(
    id: number,
    state: ISupportState
  ): Observable<ISupportState> {
    return this.httpClient.put<ISupportState>(`${this.URL}/s/${id}`, state);
  }
}
