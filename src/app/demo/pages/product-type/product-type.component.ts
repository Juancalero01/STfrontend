import { Component } from '@angular/core';

@Component({
  selector: 'app-product-type',
  template: `
    <section class="h-full flex flex-column gap-4">
      <app-panel-header
        title="Gestión de Tipos de producto"
        subtitle="Administra y gestiona los datos de tus tipos de producto en este panel."
      >
      </app-panel-header>
      <app-product-type-table />
    </section>
  `,
})
export class ProductTypeComponent {}
