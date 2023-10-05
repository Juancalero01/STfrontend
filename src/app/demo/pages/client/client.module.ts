import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { ClientTableComponent } from './components/table/client-table.component';
import { ClientFormComponent } from './components/form/client-form.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [ClientComponent, ClientTableComponent, ClientFormComponent],
  imports: [CommonModule, ClientRoutingModule, SharedModule],
})
export class ClientModule {}
