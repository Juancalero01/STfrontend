import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IndicatorComponent } from './indicator.component';
import { roleGuard } from '../../api/guards/role-guard.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: IndicatorComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['ADMINISTRADOR'],
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class IndicatorRoutingModule {}
