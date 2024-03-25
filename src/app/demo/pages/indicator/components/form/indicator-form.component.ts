import { Component, Inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-indicator-form',
  templateUrl: './indicator-form.component.html',
})
export class IndicatorFormComponent {
  constructor(
    private readonly config: DynamicDialogConfig,
    @Inject(DOCUMENT) private document: Document
  ) {}
  public supports: ISupport[] = [];

  ngOnInit(): void {
    if (this.config.data) {
      this.loadTable(this.config.data);
    }
  }

  /**
   * Carga los datos de soporte en la tabla de la interfaz de usuario.
   * @param supports Los datos de soporte que se cargarán en la tabla.
   */
  private loadTable(supports: ISupport[]): void {
    this.supports = supports;
  }

  /**
   * Genera una URL para ver el historial de reclamaciones de soporte.
   * @param reclaim El número de reclamación para el cual se desea ver el historial.
   * @returns La URL completa que dirige al historial de reclamaciones de soporte para el reclamo dado.
   */
  getSupportHistoryUrl(reclaim: string): string {
    return `${this.document.baseURI}cnet/support/history?s=${reclaim}`;
  }

  /**
   * Determina el tipo de etiqueta (tag) según el estado del servicio.
   * @param stateId El identificador del estado del servicio.
   * @returns El tipo de etiqueta (tag) correspondiente al estado del servicio.
   */
  public getTagSeverity(stateId: number): string {
    if (stateId === 12) {
      return 'success';
    } else {
      return 'warning';
    }
  }
}
