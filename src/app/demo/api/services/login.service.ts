import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { ILogin } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private httpClient: HttpClient) {}
  private readonly URL = environment.apiUrl + '/login';

  public login(login: ILogin): Observable<ILogin> {
    return this.httpClient.post<ILogin>(this.URL, login);
  }
}
