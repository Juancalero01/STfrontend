import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientComponent } from './client.component';
import { roleGuard } from '../../api/guards/role-guard.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ClientComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['ADMINISTRADOR'],
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
