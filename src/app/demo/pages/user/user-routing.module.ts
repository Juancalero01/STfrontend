import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { roleGuard } from '../../api/guards/role-guard.guard';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        canActivate: [roleGuard],
        component: UserComponent,
        data: {
          roles: ['ADMINISTRADOR'],
        },
      },
      {
        path: 'profile',
        canActivate: [roleGuard],
        component: ProfileComponent,
        data: {
          roles: ['ADMINISTRADOR', 'TECNICO'],
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class UserRoutingModule {}
