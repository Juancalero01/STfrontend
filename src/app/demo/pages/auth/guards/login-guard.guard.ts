import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from 'src/app/demo/api/services/token.service';

export const loginGuardGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  let token = tokenService.getToken();
  return token !== null ? router.navigate(['cnet']) : true;
};
