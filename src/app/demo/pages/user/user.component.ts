import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  template: `
    <section class="h-full flex flex-column gap-4">
      <app-panel-header
        title="Gestión de Usuarios"
        subtitle="Administra y gestiona los datos de tus usuarios en este panel."
      >
      </app-panel-header>
      <app-table-user />
    </section>
  `,
})
export class UserComponent {}
