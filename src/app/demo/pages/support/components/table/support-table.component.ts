import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
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
    private readonly dialogService: DialogService
  ) {}

  public supportData: ISupport[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();
  //! REVISAR PORQUE NO APARECE EL NUEVO EN LA SOLICITUD NUEVA PUEDE SER PORQUE SE IMPLEMENTO DATETIME en el backend
  // public today: string = new Date().toISOString().split('T')[0];
  // public today: string = new Date().toISOString().split('T')[0];

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

  public loadSupports(): void {
    this.supportService.findAll().subscribe({
      next: (supports: ISupport[]) => {
        this.supportData = supports.sort(
          (a, b) => a.priority.id - b.priority.id
        );
      },
      error: () => {},
      complete() {},
    });
  }

  public openSupportForm(support?: ISupport) {
    this.ref = this.dialogService.open(SupportFormComponent, {
      header: support
        ? 'FORMULARIO DE ACTUALIZACIÓN DE SOPORTE TÉCNICO'
        : 'FORMULARIO DE REGISTRO DE SOPORTE TÉCNICO',
      width: '100vw',
      style: { 'min-width': '100vw', 'min-height': '100vh' },
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: support,
    });
    this.ref.onClose.subscribe(() => this.loadSupports());
  }

  public cleanFilters(table: Table, filter: any) {
    table.clear();
    filter.value = '';
  }

  // public newEntryToday(dateEntry: Date): boolean {
  //   const dateEntryNew = new Date(dateEntry).toISOString().split('T')[0];
  //   console.log(this.today);
  //   console.log(dateEntryNew);
  //   return true;
  // }

  //TODO: Proximanente una funcionalidad para que pinte dependiendo los dias que van pasando desde la fecha de creacion y la propiedad de vencimiento de la prioridad
}
