import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { SupportFormComponent } from '../form/support-form.component';
import { SupportService } from 'src/app/demo/api/services/support.service';
import { Table } from 'primeng/table';

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
  public today: string = new Date().toISOString().split('T')[0];

  public priorityColors: any = {
    INMEDIATA: 'bg-red-500 w-full',
    ALTA: 'bg-orange-500 w-full',
    MEDIA: 'bg-yellow-500 w-full',
    BAJA: 'bg-green-500 w-full',
  };

  public ngOnInit(): void {
    this.loadSupports();
  }

  public ngDestroy(): void {
    if (this.ref) this.ref.close();
  }

  private loadSupports(): void {
    this.supportService.findAll().subscribe({
      next: (supports: ISupport[]) => {
        this.supportData = supports.sort(
          (a, b) => a.priority.id - b.priority.id
        );
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

    this.ref.onClose.subscribe(() => {
      this.loadSupports();
    });
  }

  public updateSupport(support: ISupport): void {
    this.ref = this.dialogService.open(SupportFormComponent, {
      header: 'FORMULARIO DE ACTUALIZACIÓN DE SOPORTE TÉCNICO',
      width: '100vw',
      style: { 'min-width': '100vw', 'min-height': '100vh' },
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: support,
    });

    this.ref.onClose.subscribe(() => {
      this.loadSupports();
    });
  }

  public getPercentage(support: ISupport): number {
    const percentages: any = {
      1: 0,
      2: 20,
      3: 30,
      4: 30,
      5: 50,
      6: 90,
      7: 99,
      8: 0,
      9: 0,
    };

    return percentages[support.state.id];
  }

  public cleanFilters(table: Table, filter: any) {
    table.clear();
    filter.value = '';
  }
}
