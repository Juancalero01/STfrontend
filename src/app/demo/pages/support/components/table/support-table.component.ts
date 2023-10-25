import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { SupportFormComponent } from '../form/support-form.component';
import { SupportService } from 'src/app/demo/api/services/support.service';

@Component({
  selector: 'app-support-table',
  templateUrl: './support-table.component.html',
})
export class SupportTableComponent {
  constructor(
    private readonly supportService: SupportService,
    private readonly dialogService: DialogService,
    private readonly messageService: MessageService
  ) {}

  public supportData: ISupport[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();

  public ngOnInit(): void {
    this.loadSupports();
  }

  public ngDestroy(): void {
    if (this.ref) this.ref.close();
  }

  private loadSupports(): void {
    this.supportService.findAll().subscribe({
      next: (supports: ISupport[]) => {
        this.supportData = supports;
      },
      error: (e: any) => {
        if (e.status === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error de conexión con el servidor',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los soportes',
          });
        }
      },
    });
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

  public updateSupport(): void {}

  public getPriorityClass(priority: string): string {
    switch (priority) {
      case 'INMEDIATA':
        return 'danger';
      case 'ALTA':
        return 'danger';
      case 'MEDIA':
        return 'warning';
      default:
        return 'info';
    }
  }
}
