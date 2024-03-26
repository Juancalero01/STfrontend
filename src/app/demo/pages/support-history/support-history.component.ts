import { Component } from '@angular/core';

@Component({
  selector: 'app-support-history',
  template: `
    <section class="h-full flex flex-column gap-4">
      <app-panel-header
        title="Historial de Servicios Técnicos"
        subtitle="Consulta y administra el historial de los servicios técnicos en este panel."
      >
      </app-panel-header>
      <app-support-history-table />
    </section>
  `,
})
export class SupportHistoryComponent {}
