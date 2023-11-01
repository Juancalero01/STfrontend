import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { NotfoundComponent } from './demo/pages/notfound/notfound.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: AppLayoutComponent,
          children: [
            {
              path: '',
              loadChildren: () =>
                import('./demo/pages/home/home.module').then(
                  (m) => m.HomeModule
                ),
            },
            {
              path: 'support',
              loadChildren: () =>
                import('./demo/pages/support/support.module').then(
                  (m) => m.SupportModule
                ),
            },

            {
              path: 'client',
              loadChildren: () =>
                import('./demo/pages/client/client.module').then(
                  (m) => m.ClientModule
                ),
            },
            {
              path: 'product',
              loadChildren: () =>
                import('./demo/pages/product/product.module').then(
                  (m) => m.ProductModule
                ),
            },
            {
              path: 'product-type',
              loadChildren: () =>
                import('./demo/pages/product-type/product-type.module').then(
                  (m) => m.ProductTypeModule
                ),
            },
          ],
        },
        { path: 'notfound', component: NotfoundComponent },
        { path: '**', redirectTo: '/notfound' },
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload',
      }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
