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

  //Inicializador de funciones.
  ngOnInit(): void {
    if (this.config.data) {
      this.loadTable(this.config.data);
    }
  }

  //Carga de soportes en la tabla.
  private loadTable(supports: ISupport[]): void {
    this.supports = supports;
  }

  //Crea un vinculo para ir a verificar ese número de reclamo.
  getSupportHistoryUrl(reclaim: string): string {
    return `${this.document.baseURI}cnet/support/history?s=${reclaim}`;
  }

  //Añade un tag segun el estado del servicio.
  public getTagSeverity(stateId: number): string {
    if (stateId === 12) {
      return 'success';
    } else {
      return 'warning';
    }
  }
}
