import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { SupportService } from 'src/app/demo/api/services/support.service';
import { SupportHistoryFormComponent } from '../form/support-history-form.component';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-support-history-table',
  templateUrl: './support-history-table.component.html',
})
export class SupportHistoryTableComponent {
  constructor(
    private readonly supportService: SupportService,
    private readonly dialogService: DialogService,
    private readonly formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private readonly messageService: MessageService
  ) {}

  public supports: ISupport[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();
  public reclaim!: string;
  public showFilters: boolean = true;
  public showSearch: boolean = false;
  public showCleanFilters: boolean = false;
  public historyForm: FormGroup = this.buildHistoryForm();

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.reclaim = params.get('s') || '';
    });
    if (this.reclaim) {
      this.searchReclaimService(this.reclaim);
      this.showFilters = false;
      this.showSearch = true;
    }
    this.historyForm.valueChanges.subscribe({
      next: ({ reclaim, serial }) => {
        const reclaimControl = this.historyForm.get('reclaim');
        const serialControl = this.historyForm.get('serial');
        if (reclaim && reclaim.trim() !== '') {
          if (serialControl?.enabled) {
            serialControl?.disable({ emitEvent: false });
            serialControl.removeValidators(Validators.required);
            serialControl.updateValueAndValidity();
          }
        } else {
          if (serialControl?.disabled) {
            serialControl?.enable({ emitEvent: false });
            serialControl.addValidators(Validators.required);
            serialControl.updateValueAndValidity();
          }
        }
        if (serial && serial.trim() !== '') {
          if (reclaimControl?.enabled) {
            reclaimControl?.disable({ emitEvent: false });
            reclaimControl.removeValidators(Validators.required);
            reclaimControl.updateValueAndValidity();
          }
        } else {
          if (reclaimControl?.disabled) {
            reclaimControl?.enable({ emitEvent: false });
            reclaimControl.addValidators(Validators.required);
            reclaimControl.updateValueAndValidity();
          }
        }
      },
    });
  }

  //Construcción de los campos y validaciones del formulario de busqueda del historial del servicio.
  private buildHistoryForm(): FormGroup {
    return this.formBuilder.group({
      reclaim: [
        null,
        [Validators.required, Validators.pattern(/^CNET-\d{8}-\d+$/)],
      ],
      serial: [
        null,
        [Validators.required, Validators.pattern(/^\d{1,4}(-\d{4,5})?$/)],
      ],
    });
  }

  /**
   * Abre el formulario para visualizar o editar el historial de cambios de estado,
   * notas, fallas o detalles del servicio en general.
   * @param supportData (Opcional) El objeto ISupport que contiene la información del servicio.
   * Si se proporciona, se utilizará para cargar los datos del servicio en el formulario.
   */
  public openSupportHistoryForm(supportData?: ISupport): void {
    this.ref = this.dialogService.open(SupportHistoryFormComponent, {
      header: `INFORMACIÓN DEL SERVICIO`,
      width: '80%',
      height: '80%',
      closable: true,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      maximizable: true,
      position: 'center',
      data: supportData,
    });
  }

  /**
   * Determina y devuelve el nombre de la clase CSS que representa el nivel de severidad
   * según el estado del servicio.
   * @param stateId El identificador del estado del servicio.
   * @returns El nombre de la clase CSS que indica el nivel de severidad.
   */
  public getTagSeverity(stateId: number): string {
    if (stateId === 13) {
      return 'danger';
    } else if (stateId === 12) {
      return 'success';
    } else {
      return 'info';
    }
  }

  /**
   * Realiza una búsqueda de servicios según el número de reclamo o el número de serie del producto.
   * Si se proporciona un número de reclamo, se realiza una búsqueda por reclamo.
   * Si se proporciona un número de serie, se realiza una búsqueda por número de serie del producto.
   * Finalmente, muestra los resultados de la búsqueda y activa la opción para limpiar los filtros.
   */
  public searchHistory() {
    const reclaimValue = this.historyForm.get('reclaim')?.value;
    const serialValue = this.historyForm.get('serial')?.value;
    if (reclaimValue && reclaimValue.trim() !== '') {
      this.searchReclaimService(reclaimValue);
    } else if (serialValue && serialValue.trim() !== '') {
      this.searchSerialProduct(serialValue);
    }
    this.showSearch = true;
    this.showCleanFilters = true;
  }

  /**
   * Realiza una búsqueda de servicios utilizando el número de reclamo proporcionado.
   * @param reclaim El número de reclamo del servicio a buscar.
   */
  public searchReclaimService(reclaim: string): void {
    this.supportService.getServiceByReclaim(reclaim).subscribe({
      next: (supports: ISupport[]) => {
        if (supports.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Operación',
            detail: 'Sin resultados',
          });
          this.showSearch = false;
        }
        this.supports = supports;
      },
    });
  }

  /**
   * Realiza una búsqueda de servicios utilizando el número de serie del producto proporcionado.
   * @param serial El número de serie del producto para buscar servicios asociados.
   */
  public searchSerialProduct(serial: string): void {
    this.supportService.getServicesByProductSerial(serial).subscribe({
      next: (supports: ISupport[]) => {
        if (supports.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Operación',
            detail: 'Sin resultados',
          });
          this.showSearch = false;
        }
        this.supports = supports;
      },
    });
  }

  /**
   * Verifica si se han realizado cambios en el formulario de historial del servicio.
   * @returns Devuelve true si el usuario ha modificado el formulario, de lo contrario, devuelve false.
   */
  public getChangesToUpdate(): boolean {
    return !this.historyForm.pristine;
  }

  /**
   * Restablece los filtros del formulario de búsqueda del historial de servicios.
   * Además, muestra un mensaje informativo sobre la operación realizada.
   */
  public cleanFormAndSearch() {
    this.historyForm.reset();
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Filtros reseteados',
    });
    this.showSearch = false;
    this.showCleanFilters = false;
  }
}
