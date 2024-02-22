import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupportComponent } from './support.component';
import { roleGuard } from '../../api/guards/role-guard.guard';
import { SupportManyComponent } from './support-many/support-many.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        canActivate: [roleGuard],
        component: SupportComponent,
        data: {
          roles: ['ADMINISTRADOR', 'TECNICO'],
        },
      },
      {
        path: 'many',
        canActivate: [roleGuard],
        component: SupportManyComponent,
        data: {
          roles: ['ADMINISTRADOR', 'TECNICO'],
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class SupportRoutingModule {}
