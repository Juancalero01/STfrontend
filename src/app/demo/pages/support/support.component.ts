import { Component } from '@angular/core';

@Component({
  selector: 'app-support',
  template: `
    <section class="h-full flex flex-column gap-4">
      <app-panel-header
        title="Gestión de Servicios Técnicos "
        subtitle="Administra y gestiona los datos de tus ingresos en este panel."
      >
      </app-panel-header>

      <app-support-table />
    </section>
  `,
})
export class SupportComponent {}
