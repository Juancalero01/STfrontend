import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { SupportFormComponent } from '../form/support-form.component';
import { SupportService } from 'src/app/demo/api/services/support.service';
import { Table } from 'primeng/table';
import { TokenService } from 'src/app/demo/api/services/token.service';

@Component({
  selector: 'app-support-table',
  templateUrl: './support-table.component.html',
})
export class SupportTableComponent {
  constructor(
    private readonly supportService: SupportService,
    private readonly dialogService: DialogService,
    private readonly tokenService: TokenService
  ) {}

  public supportData: ISupport[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();
  public visibleAdmin: boolean = this.tokenService.isAdmin();
  public today: Date = new Date();

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
    this.supportService.findAllActiveServices().subscribe({
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

  public getEntryNewTag(dateEntry: Date): boolean {
    const todayWithoutTime = new Date();
    todayWithoutTime.setHours(0, 0, 0, 0);

    return (
      new Date(dateEntry).setHours(0, 0, 0, 0) === todayWithoutTime.getTime()
    );
  }
}
