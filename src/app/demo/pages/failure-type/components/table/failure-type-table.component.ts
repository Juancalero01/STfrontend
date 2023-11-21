import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
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
    private readonly messageService: MessageService,
    private readonly dialogService: DialogService
  ) {}

  public failureTypeData: IFailureType[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();

  public ngOnInit() {
    this.loadFailureTypes();
  }

  public ngDestroy(): void {
    if (this.ref) this.ref.close();
  }

  private loadFailureTypes(): void {
    this.failureTypeService.findAll().subscribe({
      next: (failureTypes: IFailureType[]) =>
        (this.failureTypeData = failureTypes),
    });
  }

  public createProductType() {
    this.ref = this.dialogService.open(FailureTypeFormComponent, {
      header: 'FORMULARIO DE REGISTRO DE TIPO DE FALLA',
      width: '50%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
    });

    this.ref.onClose.subscribe(() => {
      this.loadFailureTypes();
    });
  }

  public updateProductType(failureType: IFailureType) {
    this.ref = this.dialogService.open(FailureTypeFormComponent, {
      header: 'FORMULARIO DE ACTUALIZACIÓN DE TIPO DE FALLA',
      width: '50%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: failureType,
    });

    this.ref.onClose.subscribe(() => {
      this.loadFailureTypes();
    });
  }

  public cleanFilters(table: Table, filter: any) {
    table.clear();
    filter.value = '';
  }
}
