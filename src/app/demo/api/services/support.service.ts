import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { ISupport, ISupportMany } from '../interfaces/support.interface';
@Injectable({
  providedIn: 'root',
})
export class SupportService {
  constructor(private httpClient: HttpClient) {}

  private readonly URL = environment.apiUrl + '/service';

  public findAll(): Observable<ISupport[]> {
    return this.httpClient.get<ISupport[]>(`${this.URL}/all`);
  }

  public findAllActiveServices(): Observable<ISupport[]> {
    return this.httpClient.get<ISupport[]>(this.URL);
  }

  public getServiceMain(): Observable<any> {
    return this.httpClient.get<any>(`${this.URL}/h`);
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

  public updateState(id: number, state: number): Observable<any> {
    const requestBody = { state };
    return this.httpClient.put<any>(`${this.URL}/s/${id}`, requestBody);
  }

  public setDateDeparture(id: number, dateDeparture: Date): Observable<any> {
    const requestBody = { dateDeparture };
    return this.httpClient.put<any>(`${this.URL}/d/${id}`, requestBody);
  }

  public setRepairedTime(id: number, repairedTime: number): Observable<any> {
    const requestBody = { repairedTime };
    return this.httpClient.put<any>(`${this.URL}/rt/${id}`, requestBody);
  }

  public findAllByProduct(id: number): Observable<ISupport[]> {
    return this.httpClient.get<ISupport[]>(`${this.URL}/p/${id}`);
  }

  public getServiceIndicators(body: any) {
    return this.httpClient.post<any>(`${this.URL}/i`, body);
  }

  public getServicesByProductSerial(serial: string): Observable<ISupport[]> {
    return this.httpClient.get<ISupport[]>(`${this.URL}/ss/${serial}`);
  }

  public getServiceByReclaim(reclaim: string): Observable<ISupport[]> {
    return this.httpClient.get<ISupport[]>(`${this.URL}/sr/${reclaim}`);
  }

  public createMany(supports: ISupportMany[]): Observable<ISupportMany[]> {
    return this.httpClient.post<ISupportMany[]>(`${this.URL}/many`, supports);
  }

  public updateMany(supports: ISupport[]): Observable<ISupport[]> {
    return this.httpClient.put<ISupport[]>(`${this.URL}/umany`, supports);
  }
}
