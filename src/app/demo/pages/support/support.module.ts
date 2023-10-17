import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRoutingModule } from './support-routing.module';
import { SupportComponent } from './support.component';
import { SupportTableComponent } from './components/table/support-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SupportFormComponent } from './components/form/support-form.component';
import { FormHistoryComponent } from './components/form-history/form-history.component';

@NgModule({
  declarations: [SupportComponent, SupportTableComponent, SupportFormComponent, FormHistoryComponent],
  imports: [CommonModule, SupportRoutingModule, SharedModule],
})
export class SupportModule {}
