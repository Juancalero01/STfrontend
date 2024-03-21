import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelHeaderComponent } from './components/panel-header/panel-header.component';

@NgModule({
  declarations: [PanelHeaderComponent],
  imports: [CommonModule],
  exports: [PanelHeaderComponent],
})
export class UiModule {}
