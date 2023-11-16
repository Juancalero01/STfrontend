import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportHistoryRoutingModule } from './support-history-routing.module';
import { SupportHistoryComponent } from './support-history.component';


@NgModule({
  declarations: [
    SupportHistoryComponent
  ],
  imports: [
    CommonModule,
    SupportHistoryRoutingModule
  ]
})
export class SupportHistoryModule { }
