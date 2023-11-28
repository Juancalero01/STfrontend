import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const expectedRoles: string[] = (route.data as { roles: string[] }).roles;
  const role: string | null = tokenService.getUserRole();
  if (role !== null && expectedRoles.includes(role)) {
    return true;
  } else {
    router.navigate(['cnet']);
    return false;
  }
};
