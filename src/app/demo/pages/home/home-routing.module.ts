import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { roleGuard } from '../../api/guards/role-guard.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['ADMINISTRADOR', 'TECNICO'],
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
