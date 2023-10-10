import { Component } from '@angular/core';
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

  public supportData: ISupport[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();

  public ngOnInit(): void {}

  public ngDestroy(): void {
    if (this.ref) this.ref.close();
  }

  public createSupport() {
    this.ref = this.dialogService.open(SupportFormComponent, {
      header: 'FORMULARIO DE REGISTRO DE SOPORTE TÉCNICO',
      width: '100vw',
      style: { 'min-width': '100vw', 'min-height': '100vh' },
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
    });
  }

  // Add logic to update the supportData array
  public updateSupport(): void {}
}
