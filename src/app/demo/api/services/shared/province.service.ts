import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IProvince } from '../../interfaces/province.interface';

@Injectable({
  providedIn: 'root',
})
export class ProvinceService {
  constructor(private httpClient: HttpClient) {}

  private readonly URL = environment.apiUrl + '/province';

  public findAll(): Observable<IProvince[]> {
    return this.httpClient.get<IProvince[]>(this.URL);
  }

  public findOne(id: number): Observable<IProvince> {
    return this.httpClient.get<IProvince>(`${this.URL}/${id}`);
  }
}
