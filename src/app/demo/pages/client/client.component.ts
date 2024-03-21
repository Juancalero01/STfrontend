import { Component } from '@angular/core';

@Component({
  selector: 'app-client',
  template: `
    <section class="h-full flex flex-column gap-4">
      <app-panel-header
        title="Gestión de Clientes"
        subtitle="Administra y gestiona los datos de tus clientes en este panel."
      >
      </app-panel-header>

      <app-client-table />
    </section>
  `,
})
export class ClientComponent {}
