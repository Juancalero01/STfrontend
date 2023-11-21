import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  public setToken(token: string, user: IUser): void {
    localStorage.setItem('token', token);
    localStorage.setItem('uid', String(user.id));
    localStorage.setItem('ufname', user.fullname);
  }

  public getToken() {
    return localStorage.getItem('token');
  }

  public getFullname() {
    return localStorage.getItem('ufname');
  }

  public deleteToken(): void {
    localStorage.clear();
  }
}
