import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISupportNote } from '../interfaces/support-note.interface';

@Injectable({
  providedIn: 'root',
})
export class SupportNoteService {
  constructor(private httpClient: HttpClient) {}
  private readonly URL = environment.apiUrl + '/service-note';

  public findAll(): Observable<ISupportNote[]> {
    return this.httpClient.get<ISupportNote[]>(this.URL);
  }

  public findOne(id: number): Observable<ISupportNote> {
    return this.httpClient.get<ISupportNote>(`${this.URL}/${id}`);
  }

  public findByServiceHistory(id: number): Observable<ISupportNote[]> {
    return this.httpClient.get<ISupportNote[]>(`${this.URL}/sh/${id}`);
  }

  public create(supportNote: ISupportNote): Observable<ISupportNote> {
    return this.httpClient.post<ISupportNote>(this.URL, supportNote);
  }

  public update(
    id: number,
    supportNote: ISupportNote
  ): Observable<ISupportNote> {
    return this.httpClient.put<ISupportNote>(`${this.URL}/${id}`, supportNote);
  }
}
