import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/demo/api/services/token.service';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {
  constructor(private readonly tokenService: TokenService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let token = this.tokenService.getToken();

    let headers = request.headers;
    if (token) {
      headers = headers.append('Authorization', `Bearer ${token}`);
    }

    request = request.clone({
      headers,
    });

    return next.handle(request);
  }
}
