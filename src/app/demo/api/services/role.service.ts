import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { IUser } from '../interfaces/user.interface';
import { Observable } from 'rxjs';
import { IRole } from '../interfaces/role.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private readonly http: HttpClient) {}

  private readonly URL = environment.apiUrl + '/role';

  public findAll(): Observable<IRole[]> {
    return this.http.get<IRole[]>(this.URL);
  }

  public findOne(id: number): Observable<IRole> {
    return this.http.get<IRole>(`${this.URL}/${id}`);
  }

  public create(role: IRole): Observable<IRole> {
    return this.http.post<IRole>(this.URL, role);
  }

  public update(id: number, role: IRole): Observable<IRole> {
    return this.http.put<IRole>(`${this.URL}/${id}`, role);
  }

  // TODO: RESET CONTRASEÑA.
}
