import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { SupportFormComponent } from '../form/support-form.component';
import { SupportService } from 'src/app/demo/api/services/support.service';
import { Table } from 'primeng/table';
import { IClient } from 'src/app/demo/api/interfaces/client.interface';
import { IProductType } from 'src/app/demo/api/interfaces/product-type.interface';
import { ISupportPriority } from 'src/app/demo/api/interfaces/support-priority.interface';
import { ISupportState } from 'src/app/demo/api/interfaces/support-state.interface';
import { ClientService } from 'src/app/demo/api/services/client.service';
import { ProductTypeService } from 'src/app/demo/api/services/product-type.service';
import { SupportPriorityService } from 'src/app/demo/api/services/support-priority.service';
import { SupportStateService } from 'src/app/demo/api/services/support-state.service';

@Component({
  selector: 'app-support-table',
  templateUrl: './support-table.component.html',
})
export class SupportTableComponent {
  constructor(
    private readonly supportService: SupportService,
    private readonly clientService: ClientService,
    private readonly productTypeService: ProductTypeService,
    private readonly priorityService: SupportPriorityService,
    private readonly stateService: SupportStateService,
    private readonly dialogService: DialogService
  ) {}

  public supports: ISupport[] = [];
  public clients: IClient[] = [];
  public productTypes: IProductType[] = [];
  public priorities: ISupportPriority[] = [];
  public states: ISupportState[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();
  public today: Date = new Date();

  public priorityColors: any = {
    INMEDIATA: 'bg-red-500 ',
    ALTA: 'bg-orange-500 ',
    MEDIA: 'bg-yellow-500 ',
    BAJA: 'bg-blue-500 ',
  };

  public ngOnInit(): void {
    this.loadSupports();
    this.loadClients();
    this.loadProductTypes();
    this.loadPriorities();
    this.loadStates();
  }

  public loadSupports(): void {
    this.supportService.findAllActiveServices().subscribe({
      next: (supports: ISupport[]) => {
        this.supports = supports;
      },
    });
  }

  private loadClients(): void {
    this.clientService.findAll().subscribe({
      next: (clients: IClient[]) => (this.clients = clients),
    });
  }

  private loadProductTypes(): void {
    this.productTypeService.findAll().subscribe({
      next: (productTypes: IProductType[]) =>
        (this.productTypes = productTypes),
    });
  }

  private loadPriorities(): void {
    this.priorityService.findAll().subscribe({
      next: (priorities: ISupportPriority[]) => (this.priorities = priorities),
    });
  }

  private loadStates(): void {
    this.stateService.findAll().subscribe({
      next: (states: ISupportState[]) => (this.states = states),
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

    this.ref.onClose.subscribe({
      next: () => {
        this.loadSupports();
      },
    });
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

  public calculateBackgroundColor(support: ISupport): string {
    const daysOfPriority: number = support.priority.days;
    const registrationDate: Date = new Date(support.dateEntry);
    const daysElapsed: number = Math.floor(
      (this.today.getTime() - registrationDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const percentage = (daysElapsed * 100) / daysOfPriority;
    if (percentage <= 25) {
      return 'bg-green-100';
    } else if (percentage <= 50) {
      return 'bg-yellow-100';
    } else if (percentage <= 75) {
      return 'bg-orange-100';
    } else {
      return 'bg-red-100';
    }
  }
}
