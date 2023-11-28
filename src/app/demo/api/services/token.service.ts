import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  public setToken(token: string, user: IUser): void {
    localStorage.setItem('utkn', token);
    localStorage.setItem('uid', String(user.id));
    localStorage.setItem('ufname', user.fullname);
    localStorage.setItem('urole', String(user.role));
  }

  public getToken() {
    return localStorage.getItem('utkn');
  }

  public getUserId() {
    return localStorage.getItem('uid');
  }

  public getUserFullname() {
    return localStorage.getItem('ufname');
  }

  public getUserRole() {
    return localStorage.getItem('urole');
  }

  public deleteToken(): void {
    localStorage.clear();
  }
}
