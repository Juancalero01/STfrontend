import { Injectable } from '@angular/core';
import { IClient } from '../interfaces/client.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private httpClient: HttpClient) {}

  private readonly URL = environment.apiUrl + '/client';

  public findAll(): Observable<IClient[]> {
    return this.httpClient.get<IClient[]>(this.URL);
  }

  public findOne(id: number): Observable<IClient> {
    return this.httpClient.get<IClient>(`${this.URL}/${id}`);
  }

  public create(client: IClient): Observable<IClient> {
    return this.httpClient.post<IClient>(this.URL, client);
  }

  public update(id: number, client: IClient): Observable<IClient> {
    return this.httpClient.put<IClient>(`${this.URL}/${id}`, client);
  }
}
