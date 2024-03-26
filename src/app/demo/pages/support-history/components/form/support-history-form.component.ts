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

  ngOnInit(): void {
    if (this.config.data) {
      this.loadTable();
    }
  }

  /**
   * Carga los datos de la tabla utilizando la configuración proporcionada.
   * La configuración debe incluir los datos de los servicios y su historial asociado.
   */
  private loadTable(): void {
    this.supports = this.config.data;
    this.supportHistories = this.config.data.serviceHistory;
  }

  /**
   * Determina y devuelve el nombre de la clase CSS que representa el nivel de severidad
   * según el estado del servicio.
   * @param stateId El identificador del estado del servicio.
   * @returns El nombre de la clase CSS que indica el nivel de severidad.
   */
  public getTagSeverity(stateId: number): string {
    if (stateId === 13) {
      return 'danger';
    } else if (stateId === 12) {
      return 'success';
    } else {
      return 'info';
    }
  }
}
