import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { NotfoundComponent } from './demo/pages/notfound/notfound.component';
import { jwtGuard } from './demo/api/guards/jwt.guard';
import { loginGuard } from './demo/api/guards/login.guard';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          redirectTo: 'auth',
          pathMatch: 'full',
        },
        {
          path: 'auth',
          canActivate: [loginGuard],
          loadChildren: () =>
            import('./demo/pages/auth/auth.module').then((m) => m.AuthModule),
        },
        {
          path: 'cnet',
          component: AppLayoutComponent,
          canActivate: [jwtGuard],
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
              path: 'support/history',
              loadChildren: () =>
                import(
                  './demo/pages/support-history/support-history.module'
                ).then((m) => m.SupportHistoryModule),
            },
            {
              path: 'support/failure',
              loadChildren: () =>
                import('./demo/pages/failure-type/failure-type.module').then(
                  (m) => m.FailureTypeModule
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
              path: 'product/type',
              loadChildren: () =>
                import('./demo/pages/product-type/product-type.module').then(
                  (m) => m.ProductTypeModule
                ),
            },
            {
              path: 'user',
              loadChildren: () =>
                import('./demo/pages/user/user.module').then(
                  (m) => m.UserModule
                ),
            },
          ],
        },
        { path: 'notfound', component: NotfoundComponent },
        { path: '**', redirectTo: '/notfound', pathMatch: 'full' },
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
