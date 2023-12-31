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
  public ref: DynamicDialogRef = new DynamicDialogRef();

  public ngOnInit() {
    this.loadFailureTypes();
  }

  private loadFailureTypes(): void {
    this.failureTypeService.findAll().subscribe({
      next: (failureTypes: IFailureType[]) => {
        this.failureTypes = failureTypes;
      },
    });
  }

  public openFailureTypeForm(failureType?: IFailureType): void {
    const header = failureType
      ? 'FORMULARIO DE ACTUALIZACIÓN DE TIPO DE FALLA'
      : 'FORMULARIO DE REGISTRO DE TIPO DE FALLA';
    this.ref = this.dialogService.open(FailureTypeFormComponent, {
      header: header,
      width: '50%',
      height: 'auto',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: failureType,
    });

    this.ref.onClose.subscribe({
      next: () => {
        this.loadFailureTypes();
      },
    });
  }

  public cleanFilters(table: Table, filter: any): void {
    table.clear();
    filter.value = '';
  }
}
