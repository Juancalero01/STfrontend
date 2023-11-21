import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FailureTypeComponent } from './failure-type.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: FailureTypeComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class FailureTypeRoutingModule {}
