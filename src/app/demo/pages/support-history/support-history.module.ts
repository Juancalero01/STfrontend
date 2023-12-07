import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportHistoryRoutingModule } from './support-history-routing.module';
import { SupportHistoryComponent } from './support-history.component';
import { SupportHistoryTableComponent } from './components/table/support-history-table.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SupportHistoryComponent, SupportHistoryTableComponent],
  imports: [CommonModule, SupportHistoryRoutingModule, SharedModule],
})
export class SupportHistoryModule {}
