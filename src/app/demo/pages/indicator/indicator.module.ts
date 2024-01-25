import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndicatorRoutingModule } from './indicator-routing.module';
import { IndicatorComponent } from './indicator.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndicatorFormComponent } from './components/form/indicator-form.component';

@NgModule({
  declarations: [IndicatorComponent, IndicatorFormComponent],
  imports: [CommonModule, IndicatorRoutingModule, SharedModule],
})
export class IndicatorModule {}
