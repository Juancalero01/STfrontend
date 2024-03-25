import { Component } from '@angular/core';

@Component({
  selector: 'app-product',
  template: `
    <section class="h-full flex flex-column gap-4">
      <app-panel-header
        title="Gestión de Productos"
        subtitle="Administra y gestiona los datos de tus productos en este panel."
      >
      </app-panel-header>
      <app-product-table />
    </section>
  `,
})
export class ProductComponent {}
