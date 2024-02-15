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
      //TODO: Perfil para modificar el usuario logeado, debe estar logeado si o si, si no no deja luego debe logout cuando cambie la contraseña, solamente la contraseña.
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
