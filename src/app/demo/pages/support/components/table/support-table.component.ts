import { Component } from '@angular/core';
import { Table } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { SupportFormComponent } from '../form/support-form.component';

@Component({
  selector: 'app-support-table',
  templateUrl: './support-table.component.html',
})
export class SupportTableComponent {
  constructor(
    private readonly dialogService: DialogService,
    private readonly messageService: MessageService
  ) {}

  supportData: ISupport[] = [];
  ref: DynamicDialogRef = new DynamicDialogRef();

  ngOnInit(): void {}

  openCreateDialog() {
    this.ref = this.dialogService.open(SupportFormComponent, {
      header: 'Nuevo Ingreso',
      width: '50%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
    });
  }
}
