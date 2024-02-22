import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRoutingModule } from './support-routing.module';
import { SupportComponent } from './support.component';
import { SupportTableComponent } from './components/table/support-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SupportFormComponent } from './components/form/support-form.component';
import { SupportFormHistoryComponent } from './components/form-history/support-form-history.component';
import { SupportManyComponent } from './support-many/support-many.component';

@NgModule({
  declarations: [
    SupportComponent,
    SupportTableComponent,
    SupportFormComponent,
    SupportFormHistoryComponent,
    SupportManyComponent,
  ],
  imports: [CommonModule, SupportRoutingModule, SharedModule],
})
export class SupportModule {}
