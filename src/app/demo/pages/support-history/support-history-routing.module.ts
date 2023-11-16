import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupportHistoryComponent } from './support-history.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: SupportHistoryComponent }]),
  ],
  exports: [RouterModule],
})
export class SupportHistoryRoutingModule {}
