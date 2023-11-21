import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FailureTypeRoutingModule } from './failure-type-routing.module';
import { FailureTypeComponent } from './failure-type.component';
import { FailureTypeTableComponent } from './components/table/failure-type-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FailureTypeFormComponent } from './components/form/failure-type-form.component';

@NgModule({
  declarations: [FailureTypeComponent, FailureTypeTableComponent, FailureTypeFormComponent],
  imports: [CommonModule, FailureTypeRoutingModule, SharedModule],
})
export class FailureTypeModule {}
