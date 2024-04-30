import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { ProductTableComponent } from './components/table/product-table.component';
import { ProductFormComponent } from './components/form/product-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductPartFormComponent } from './components/form/product-part-form.component';

@NgModule({
  declarations: [
    ProductComponent,
    ProductTableComponent,
    ProductFormComponent,
    ProductPartFormComponent,
  ],
  imports: [CommonModule, ProductRoutingModule, SharedModule],
})
export class ProductModule {}
