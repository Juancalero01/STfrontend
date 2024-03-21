import { Component } from '@angular/core';

@Component({
  selector: 'app-failure-type',
  template: `
    <section class="h-full flex flex-column gap-4">
      <app-panel-header
        title="Gestión de Fallas"
        subtitle="Administra y gestiona los datos de los tipos de fallas en este panel."
      />
      <app-failure-type-table />
    </section>
  `,
})
export class FailureTypeComponent {}
