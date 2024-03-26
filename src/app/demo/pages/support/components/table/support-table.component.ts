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

  ngOnInit(): void {
    this.loadClients();
    this.loadProductTypes();
    this.loadPriorities();
    this.loadStates();
    this.loadSupports();
  }

  /**
   * Carga los servicios activos para ser visualizados en la tabla.
   * Utiliza el servicio de soporte para obtener todos los servicios activos.
   * Actualiza la lista de servicios en el componente con los resultados obtenidos.
   */
  public loadSupports(): void {
    this.supportService.findAllActiveServices().subscribe({
      next: (supports: ISupport[]) => {
        this.supports = supports;
      },
    });
  }

  /**
   * Carga los clientes para su visualización en el componente.
   * Utiliza el servicio de cliente para obtener todos los clientes disponibles.
   * Actualiza la lista de clientes en el componente con los resultados obtenidos.
   */
  private loadClients(): void {
    this.clientService.findAll().subscribe({
      next: (clients: IClient[]) => (this.clients = clients),
    });
  }

  /**
   * Carga los tipos de producto para su visualización en el componente.
   * Utiliza el servicio de tipo de producto para obtener todos los tipos de producto disponibles.
   * Actualiza la lista de tipos de producto en el componente con los resultados obtenidos.
   */
  private loadProductTypes(): void {
    this.productTypeService.findAll().subscribe({
      next: (productTypes: IProductType[]) =>
        (this.productTypes = productTypes),
    });
  }

  /**
   * Carga las prioridades de soporte para su visualización en el componente.
   * Utiliza el servicio de prioridad de soporte para obtener todas las prioridades disponibles.
   * Actualiza la lista de prioridades en el componente con los resultados obtenidos.
   */
  private loadPriorities(): void {
    this.priorityService.findAll().subscribe({
      next: (priorities: ISupportPriority[]) => (this.priorities = priorities),
    });
  }

  /**
   * Carga los estados para los filtros de columna (Estados).
   * Utiliza el servicio de estado para obtener todos los estados disponibles.
   * Filtra los estados para excluir aquellos con ID 12 y 13, que son estados especiales.
   * Actualiza la lista de estados en el componente con los resultados obtenidos.
   */
  private loadStates(): void {
    this.stateService.findAll().subscribe({
      next: (states: ISupportState[]) => {
        this.states = states.filter(
          (state) => state.id !== 12 && state.id !== 13
        );
      },
    });
  }

  /**
   * Abre el formulario para registrar o actualizar el servicio de soporte técnico.
   * Si se proporciona un objeto de soporte, abre el formulario de actualización; de lo contrario, abre el formulario de registro.
   * Utiliza el servicio de diálogo para abrir el componente de formulario de soporte técnico.
   * Actualiza la lista de soportes después de cerrar el formulario.
   */
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

  /**
   * Elimina los filtros de búsqueda o paginación en una tabla.
   * @param table La tabla (Table) de PrimeNG de la que se eliminarán los filtros.
   * @param filter El filtro de búsqueda o paginación que se reiniciará.
   */
  public cleanFilters(table: Table, filter: any) {
    table.clear();
    filter.value = '';
    this.selectedSupports = [];
  }

  /**
   * Determina si el servicio tiene una etiqueta "NUEVO" para identificar los servicios recientes.
   * La etiqueta "NUEVO" permanece durante 1 día antes de desaparecer.
   * @param dateEntry La fecha de entrada del servicio.
   * @returns true si el servicio es nuevo y debe tener la etiqueta "NUEVO"; de lo contrario, false.
   */
  public getEntryNewTag(dateEntry: Date): boolean {
    const todayWithoutTime = new Date();
    todayWithoutTime.setHours(0, 0, 0, 0);

    return (
      new Date(dateEntry).setHours(0, 0, 0, 0) === todayWithoutTime.getTime()
    );
  }

  /**
   * Calcula el color de fondo según el porcentaje de días transcurridos con respecto a la prioridad del servicio.
   * @param support El servicio del cual se va a calcular el color de fondo.
   * @returns El color de fondo basado en el porcentaje de días transcurridos.
   */
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

  /**
   * Genera un enlace para verificar el número de reclamo en la página de soporte múltiple.
   * @returns El enlace generado para la página de soporte múltiple.
   */
  public getSupportManyUrl(): string {
    return `${this.document.baseURI}cnet/support/many`;
  }

  /**
   * Verifica si el estado del soporte está fuera del rango seleccionable.
   * @param support El soporte del cual verificar el estado.
   * @returns Verdadero si el estado del soporte está fuera del rango seleccionable, de lo contrario, falso.
   */
  public isInvalidSelectableState(support: ISupport) {
    return support.state.id !== 11;
  }

  /**
   * Verifica si una fila es seleccionable en función del estado del soporte.
   * @param rowData Los datos de la fila a evaluar.
   * @returns Verdadero si la fila es seleccionable, de lo contrario, falso.
   */
  public isRowSelectable(event: any) {
    return !this.isInvalidSelectableState(event.data);
  }

  /**
   * Calcula el estado de la prioridad del soporte en función del tiempo transcurrido.
   * @param dateEntry La fecha de entrada del soporte.
   * @param priorityDays El número de días de la prioridad del soporte.
   * @returns Un objeto con información sobre el estado de la prioridad.
   */
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

  /**
   * Abre el formulario para cerrar múltiples casos de soporte simultáneamente.
   * Si el usuario no es administrador, se muestra un mensaje informativo.
   */
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
        header: 'ACTUALIZACIÓN MASIVA',
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
          this.selectedSupports = [];
          this.loadSupports();
        },
      });
    }
  }
}
