import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { roleGuardGuard } from '../../api/guards/role-guard.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        canActivate: [roleGuardGuard],
        component: UserComponent,
        data: {
          roles: ['ADMINISTRADOR'],
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class UserRoutingModule {}
