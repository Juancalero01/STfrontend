import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupportComponent } from './support.component';
import { roleGuard } from '../../api/guards/role-guard.guard';

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
    ]),
  ],
  exports: [RouterModule],
})
export class SupportRoutingModule {}
