import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { ILogin } from '../interfaces/login.interface';
import { IAuth } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}
  private readonly URL = environment.apiUrl + '/auth';

  public login(login: ILogin): Observable<IAuth> {
    return this.httpClient.post<IAuth>(`${this.URL}/login`, login);
  }
}
