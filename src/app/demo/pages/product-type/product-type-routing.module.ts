import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductTypeComponent } from './product-type.component';
import { roleGuardGuard } from '../../api/guards/role-guard.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        canActivate: [roleGuardGuard],
        component: ProductTypeComponent,
        data: {
          roles: ['ADMINISTRADOR'],
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ProductTypeRoutingModule {}
