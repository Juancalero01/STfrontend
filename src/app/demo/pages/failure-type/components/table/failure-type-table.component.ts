import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { IFailureType } from 'src/app/demo/api/interfaces/failure-type.interface';
import { FailureTypeService } from 'src/app/demo/api/services/failure-type.service';
import { FailureTypeFormComponent } from '../form/failure-type-form.component';

@Component({
  selector: 'app-failure-type-table',
  templateUrl: './failure-type-table.component.html',
})
export class FailureTypeTableComponent {
  constructor(
    private readonly failureTypeService: FailureTypeService,
    private readonly dialogService: DialogService
  ) {}

  public failureTypes: IFailureType[] = [];
  public dialogRef: DynamicDialogRef = new DynamicDialogRef();

  ngOnInit() {
    this.loadFailureTypes();
  }

  /**
   * Carga los tipos de fallas desde el servicio de tipos de fallas y los asigna a la propiedad 'failureTypes' para su visualización en la tabla.
   */
  private loadFailureTypes(): void {
    this.failureTypeService.findAll().subscribe({
      next: (failureTypes: IFailureType[]) => {
        this.failureTypes = failureTypes;
      },
    });
  }

  /**
   * Abre un formulario para guardar o actualizar la información de un tipo de falla.
   * @param failureTypeData Datos del tipo de falla a editar. Si no se proporciona, se abre un formulario para registrar un nuevo tipo de falla.
   */
  public openFailureTypeDialog(failureTypeData?: IFailureType): void {
    const header = failureTypeData
      ? 'ACTUALIZAR TIPO DE FALLA'
      : 'REGISTRAR TIPO DE FALLA';
    this.dialogRef = this.dialogService.open(FailureTypeFormComponent, {
      header: header,
      width: '50%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: failureTypeData,
    });

    this.dialogRef.onClose.subscribe({
      next: () => {
        this.loadFailureTypes();
      },
    });
  }

  /**
   * Elimina los filtros de búsqueda o paginación en una tabla.
   * @param table La tabla (Table) de PrimeNG de la que se eliminarán los filtros.
   * @param filter El filtro de búsqueda o paginación que se reiniciará.
   */
  public cleanFilters(table: Table, filter: any): void {
    table.clear();
    filter.value = '';
  }
}
