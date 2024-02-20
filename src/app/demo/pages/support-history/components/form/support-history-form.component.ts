import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ISupportHistory } from 'src/app/demo/api/interfaces/support-history.interface';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';

@Component({
  selector: 'app-support-history-form',
  templateUrl: './support-history-form.component.html',
})
export class SupportHistoryFormComponent {
  constructor(private readonly config: DynamicDialogConfig) {}
  public supports: ISupport = {} as ISupport;
  public supportHistories: ISupportHistory[] = [];

  //Inicializador de funciones.
  ngOnInit(): void {
    if (this.config.data) {
      this.loadTable();
    }
  }

  //Carga la tabla con sus respectivos datos.
  private loadTable(): void {
    this.supports = this.config.data;
    this.supportHistories = this.config.data.serviceHistory;
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
