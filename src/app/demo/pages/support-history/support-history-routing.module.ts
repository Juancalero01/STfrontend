import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupportHistoryComponent } from './support-history.component';
import { roleGuard } from '../../api/guards/role-guard.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        canActivate: [roleGuard],
        component: SupportHistoryComponent,
        data: {
          roles: ['ADMINISTRADOR', 'TECNICO'],
        },
      },
      {
        path: ':s',
        canActivate: [roleGuard],
        component: SupportHistoryComponent,
        data: {
          roles: ['ADMINISTRADOR', 'TECNICO'],
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class SupportHistoryRoutingModule {}
