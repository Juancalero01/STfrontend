import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { IUser } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  private readonly URL = environment.apiUrl + '/user';

  public findAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.URL);
  }

  public findOne(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.URL}/${id}`);
  }

  public create(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.URL, user);
  }

  public update(id: number, user: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${this.URL}/${id}`, user);
  }

  public resetPassword(id: number): Observable<IUser> {
    return this.http.put<IUser>(`${this.URL}/r/${id}`, {});
  }

  public changeState(id: number): Observable<IUser> {
    return this.http.put<IUser>(`${this.URL}/s/${id}`, {});
  }
}
