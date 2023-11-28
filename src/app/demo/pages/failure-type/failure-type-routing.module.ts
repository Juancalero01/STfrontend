import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FailureTypeComponent } from './failure-type.component';
import { roleGuard } from '../../api/guards/role-guard.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: FailureTypeComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['ADMINISTRADOR', 'TECNICO'],
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class FailureTypeRoutingModule {}
