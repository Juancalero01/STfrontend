import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITaxCondition } from '../interfaces/tax-condition.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TaxConditionService {
  constructor(private httpClient: HttpClient) {}

  private readonly URL = environment.apiUrl + '/tax-condition';

  public findAll(): Observable<ITaxCondition[]> {
    return this.httpClient.get<ITaxCondition[]>(this.URL);
  }

  public findOne(id: number): Observable<ITaxCondition> {
    return this.httpClient.get<ITaxCondition>(`${this.URL}/${id}`);
  }
}
