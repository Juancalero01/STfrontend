import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TokenService } from 'src/app/demo/api/services/token.service';

export const jwtGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  let token = tokenService.getToken();
  return !token ? router.navigate(['auth/login']) : true;
};
