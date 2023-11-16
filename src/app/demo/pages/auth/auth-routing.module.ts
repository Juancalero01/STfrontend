import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: AuthComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
