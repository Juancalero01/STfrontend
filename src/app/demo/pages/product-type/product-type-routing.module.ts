import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductTypeComponent } from './product-type.component';
import { roleGuard } from '../../api/guards/role-guard.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        canActivate: [roleGuard],
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
