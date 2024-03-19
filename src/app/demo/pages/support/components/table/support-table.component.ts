import { Component, Inject } from '@angular/core';
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
import { DOCUMENT } from '@angular/common';
import { TokenService } from 'src/app/demo/api/services/token.service';
import { ConfirmationService } from 'primeng/api';
import { SupportMassiveFormComponent } from '../form-massive/support-massive-form.component';

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
    private readonly dialogService: DialogService,
    @Inject(DOCUMENT) private document: Document,
    private readonly tokenService: TokenService,
    private readonly confirmationService: ConfirmationService
  ) {
    this.isRowSelectable = this.isRowSelectable.bind(this);
  }

  public supports: ISupport[] = [];
  public clients: IClient[] = [];
  public productTypes: IProductType[] = [];
  public priorities: ISupportPriority[] = [];
  public states: ISupportState[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();
  public today: Date = new Date();
  public priorityColors: any = {
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-blue-500',
  };

  public selectedSupports: ISupport[] = [];
  public priorityStatus: {
    iconClass: string;
    message: string;
    colorClass: string;
  } | null = null;

  //Inicializador de funciones.
  ngOnInit(): void {
    this.loadClients();
    this.loadProductTypes();
    this.loadPriorities();
    this.loadStates();
    this.loadSupports();
  }

  //Carga de servicios para visualizar en la tabla
  public loadSupports(): void {
    this.supportService.findAllActiveServices().subscribe({
      next: (supports: ISupport[]) => {
        this.supports = supports;
      },
    });
  }

  //Carga de clientes para filtros de columna (Clientes) GET
  private loadClients(): void {
    this.clientService.findAll().subscribe({
      next: (clients: IClient[]) => (this.clients = clients),
    });
  }

  //Carga de tipos de producto para filtros de columna (Tipos de producto) GET
  private loadProductTypes(): void {
    this.productTypeService.findAll().subscribe({
      next: (productTypes: IProductType[]) =>
        (this.productTypes = productTypes),
    });
  }

  //Carga de prioridades para filtros de columna (Prioridades) GET
  private loadPriorities(): void {
    this.priorityService.findAll().subscribe({
      next: (priorities: ISupportPriority[]) => (this.priorities = priorities),
    });
  }

  //Carga de estados para filtros de columna (Estados) GET
  private loadStates(): void {
    this.stateService.findAll().subscribe({
      next: (states: ISupportState[]) => {
        this.states = states.filter(
          (state) => state.id !== 12 && state.id !== 13
        );
      },
    });
  }

  //Abre el formulario para registrar o actualizar el servicio
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

  //Elimina los filtros (Tabla(Paginación, Filtros de columna) Buscador)
  public cleanFilters(table: Table, filter: any) {
    table.clear();
    filter.value = '';
  }

  //Añade un tag "NUEVO" para identificar los servicios recientes (Demora 1 dia en desaparecer)
  public getEntryNewTag(dateEntry: Date): boolean {
    const todayWithoutTime = new Date();
    todayWithoutTime.setHours(0, 0, 0, 0);

    return (
      new Date(dateEntry).setHours(0, 0, 0, 0) === todayWithoutTime.getTime()
    );
  }

  //Añade color segun el porcentaje de los dias de las prioridades.
  public calculateBackgroundColor(support: ISupport): string {
    const daysOfPriority: number = support.priority.days;
    const registrationDate: Date = new Date(support.dateEntry);
    const daysElapsed: number = Math.floor(
      (this.today.getTime() - registrationDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const percentage = (daysElapsed * 100) / daysOfPriority;
    if (percentage <= 25) {
      return 'bg-green-100 hover:bg-green-200';
    } else if (percentage <= 50) {
      return 'bg-yellow-100 hover:bg-yellow-200';
    } else if (percentage <= 75) {
      return 'bg-orange-100 hover:bg-orange-200';
    } else {
      return 'bg-red-100 hover:bg-red-200';
    }
  }

  //Crea un vinculo para ir a verificar ese número de reclamo.
  public getSupportManyUrl(): string {
    return `${this.document.baseURI}cnet/support/many`;
  }

  test(): void {
    console.log(this.selectedSupports);
  }

  //Indica si esta fuera del rango de estado que se puede seleccionar
  public isOutOfState(support: ISupport) {
    return support.state.id !== 11;
  }

  //Selección de filas
  public isRowSelectable(event: any) {
    return !this.isOutOfState(event.data);
  }

  //Informa el tiempo transcurrido de la prioridad.
  public getPriorityStatus(
    dateEntry: string,
    priorityDays: number
  ): { iconClass: string; message: string; colorClass: string } {
    const today = new Date();
    const entryDate = new Date(dateEntry);
    const daysElapsed = Math.floor(
      (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysElapsed <= priorityDays) {
      if (priorityDays - daysElapsed === 0) {
        return {
          iconClass: 'pi pi-exclamation-circle',
          message: 'Último día',
          colorClass: 'bg-orange-500',
        };
      } else {
        return {
          iconClass: 'pi pi-info-circle',
          message: `Quedan ${priorityDays - daysElapsed} día(s)`,
          colorClass: 'bg-green-500',
        };
      }
    } else {
      return {
        iconClass: 'pi pi-exclamation-triangle',
        message: `Expirado ${daysElapsed - priorityDays} día(s)`,
        colorClass: 'bg-red-500',
      };
    }
  }

  public openHistoryForm() {
    if (!this.tokenService.isAdmin()) {
      this.confirmationService.confirm({
        message:
          'No se puede actualizar el estado de los casos.<br>Esta acción solo está permitida para administradores.',
        header: 'INFORMACIÓN',
        icon: 'pi pi-info-circle',
        rejectVisible: false,
        acceptVisible: false,
        closeOnEscape: true,
      });
    } else {
      this.ref = this.dialogService.open(SupportMassiveFormComponent, {
        header: 'FORMULARIO DE ACTUALIZACIÓN MASIVA',
        width: '50%',
        closable: false,
        closeOnEscape: false,
        dismissableMask: false,
        showHeader: true,
        position: 'center',
        data: this.selectedSupports,
      });
      this.ref.onClose.subscribe({
        next: () => {
          this.loadSupports();
        },
      });
    }
  }
}
