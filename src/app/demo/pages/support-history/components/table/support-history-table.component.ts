import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { SupportService } from 'src/app/demo/api/services/support.service';
import { SupportHistoryFormComponent } from '../form/support-history-form.component';

@Component({
  selector: 'app-support-history-table',
  templateUrl: './support-history-table.component.html',
})
export class SupportHistoryTableComponent {
  constructor(
    private readonly supportService: SupportService,
    private readonly dialogService: DialogService
  ) {}

  public supportData: ISupport[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();

  public ngOnInit(): void {
    this.loadSupports();
  }

  public loadSupports(): void {
    this.supportService.findAll().subscribe({
      next: (supports: ISupport[]) => {
        this.supportData = supports;
      },
      error: () => {},
      complete() {},
    });
  }

  public cleanFilters(table: Table, filter: any) {
    table.clear();
    filter.value = '';
  }

  public openSupportHistoryForm(support?: ISupport) {
    this.ref = this.dialogService.open(SupportHistoryFormComponent, {
      header: `INFORMACIÓN DEL SERVICIO`,
      width: '70%',
      height: '72%',
      closable: true,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: support,
    });
  }
}
