import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportHistoryRoutingModule } from './support-history-routing.module';
import { SupportHistoryComponent } from './support-history.component';
import { SupportHistoryTableComponent } from './components/table/support-history-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SupportHistoryFormComponent } from './components/form/support-history-form.component';

@NgModule({
  declarations: [
    SupportHistoryComponent,
    SupportHistoryTableComponent,
    SupportHistoryFormComponent,
  ],
  imports: [CommonModule, SupportHistoryRoutingModule, SharedModule],
})
export class SupportHistoryModule {}
