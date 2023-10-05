import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductTypeRoutingModule } from './product-type-routing.module';
import { ProductTypeTableComponent } from './components/table/product-type-table.component';
import { ProductTypeFormComponent } from './components/form/product-type-form.component';
import { ProductTypeComponent } from './product-type.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ProductTypeComponent,
    ProductTypeTableComponent,
    ProductTypeFormComponent,
  ],
  imports: [CommonModule, ProductTypeRoutingModule, SharedModule],
})
export class ProductTypeModule {}
