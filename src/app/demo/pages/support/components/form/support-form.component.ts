import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { IFailureType } from 'src/app/demo/api/interfaces/failure-type.interface';
import { IProduct } from 'src/app/demo/api/interfaces/product.interface';
import { ISupportPriority } from 'src/app/demo/api/interfaces/support-priority.interface';
import { ISupportState } from 'src/app/demo/api/interfaces/support-state.interface';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { FailureTypeService } from 'src/app/demo/api/services/failure-type.service';
import { ProductService } from 'src/app/demo/api/services/product.service';
import { SupportPriorityService } from 'src/app/demo/api/services/support-priority.service';
import { SupportStateService } from 'src/app/demo/api/services/support-state.service';
import { SupportService } from 'src/app/demo/api/services/support.service';
import { SupportFormHistoryComponent } from '../form-history/support-form-history.component';
import { TokenService } from 'src/app/demo/api/services/token.service';
import { ISupportHistory } from 'src/app/demo/api/interfaces/support-history.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-support-form',
  templateUrl: './support-form.component.html',
})
export class SupportFormComponent {
  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly formBuilder: FormBuilder,
    private readonly failureTypeService: FailureTypeService,
    private readonly supportStateService: SupportStateService,
    private readonly supportPriorityService: SupportPriorityService,
    private readonly productService: ProductService,
    private readonly supportService: SupportService,
    private readonly dialogService: DialogService,
    private readonly tokenService: TokenService
  ) {}
  public supportForm: FormGroup = this.buildSupportForm();
  public disableButtonHistory: boolean = false;
  public mainButtonLabel: string = 'REGISTRAR FORMULARIO';
  public showButtonState: boolean = false;
  public showButtonClean: boolean = true;
  public showButtonHistory: boolean = false;
  public showSearch: boolean = true;
  public booleanDropdown: any[] = [
    { value: true, label: 'SI' },
    { value: false, label: 'NO' },
  ];
  public failureTypes: IFailureType[] = [];
  public states: ISupportState[] = [];
  public priorities: ISupportPriority[] = [];
  public supportHistory: ISupportHistory[] = [];
  public refHistory: DynamicDialogRef = new DynamicDialogRef();
  public today: Date = new Date();
  public minDate: Date = new Date(
    new Date().setMonth(new Date().getMonth() - 1)
  );
  public maxDate: Date = this.today;

  ngOnInit() {
    this.requiredFieldsByState();
    this.fieldsWithoutAdmin();
    this.setDefaultFormData();
    this.loadStates();
    this.loadPriorities();
    this.loadFailureTypes();
    if (this.config.data) {
      this.loadSupportForm(this.config.data);
      this.showButtonState = true;
      this.showButtonClean = false;
      this.showSearch = false;
      this.loadSupportHistory(this.config.data.serviceHistory);
      this.requiredFieldsByState(this.config.data.state.id);
      this.fieldsWithoutAdmin();
      this.showButtonHistory = true;
    } else {
      this.getLastReclaimNumber();
    }
  }

  /**
   * Establece los valores por defecto en el formulario de servicios.
   * Los valores incluyen el estado inicial, la fecha de entrada y la prioridad por defecto.
   */
  private setDefaultFormData(): void {
    this.supportForm.get('state')?.setValue(1);
    this.supportForm.get('dateEntry')?.setValue(this.today);
    this.supportForm.get('priority')?.setValue(4);
  }

  /**
   * Construye y retorna el formulario de soporte.
   * Este formulario incluye campos para ingresar información relevante sobre el soporte.
   * Algunos campos están deshabilitados inicialmente y se habilitan según sea necesario.
   */
  private buildSupportForm(): FormGroup {
    return this.formBuilder.group({
      search: [
        null,
        [Validators.required, Validators.pattern(/^\d{1,4}(-\d{4,5})?$/)],
      ],
      warrantyProduction: [{ value: null, disabled: true }],
      warrantyService: [{ value: null, disabled: true }],
      client: [{ value: null, disabled: true }],
      productType: [{ value: null, disabled: true }],
      productDateEntry: [{ value: null, disabled: true }],
      productSerial: [{ value: null, disabled: true }],
      dateDeparture: [{ value: null, disabled: true }],
      reclaim: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      dateEntry: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      warranty: [null, [Validators.required]],
      startReference: [null, [Validators.maxLength(255)]],
      endReference: [
        null,
        [Validators.minLength(15), Validators.pattern(/^[0-9]{4}-R-[0-9]{8}$/)],
      ],
      orderNumber: [null, [Validators.maxLength(255)]],
      quoteNumber: [null, [Validators.maxLength(255)]],
      securityStrap: [null, [Validators.required]],
      bitrixUrl: [
        null,
        [
          Validators.required,
          Validators.pattern(/^https:\/\/controlnet\.bitrix24\.es\/.*$/),
        ],
      ],
      failure: [null, [Validators.required, Validators.maxLength(255)]],
      failureTypes: [null],
      remarks: [null, [Validators.maxLength(500)]],
      product: [null, [Validators.required]],
    });
  }

  /**
   * Carga los datos del formulario de servicio con la información del soporte proporcionado.
   * @param support El objeto de soporte que contiene la información a cargar en el formulario.
   */
  private loadSupportForm(support: ISupport) {
    this.supportForm.patchValue({
      ...support,
      dateEntry: new Date(support.dateEntry),
      state: support.state.id,
      client: support.product.client.taxpayerName,
      productType: support.product.productType.name,
      productDateEntry: new Date(support.product.deliveryDate),
      productSerial: support.product.serial,
      priority: support.priority.id,
      failureTypes: support.failureTypes.map((failureType) => failureType.id),
    });
    this.supportForm.get('dateEntry')?.disable();
    this.supportForm.get('search')?.clearValidators();
    this.calculateWarranty(support.product.deliveryDate, true);
    this.mainButtonLabel = 'ACTUALIZAR FORMULARIO';
  }

  /**
   * Carga los estados de soporte disponibles.
   */
  private loadStates(): void {
    this.supportStateService.findAll().subscribe({
      next: (states: ISupportState[]) => (this.states = states),
    });
  }

  /**
   * Carga todas las prioridades de soporte.
   */
  private loadPriorities(): void {
    this.supportPriorityService.findAll().subscribe({
      next: (priorities: ISupportPriority[]) => {
        this.priorities = priorities;
      },
    });
  }

  /**
   * Carga todos los tipos de fallas para su selección.
   */
  private loadFailureTypes(): void {
    this.failureTypeService.findAll().subscribe({
      next: (failureTypes: IFailureType[]) =>
        (this.failureTypes = failureTypes),
    });
  }

  /**
   * Carga el historial de cambios de estado del servicio.
   * @param supportHistory El historial de cambios de estado del servicio.
   */
  private loadSupportHistory(supportHistory: ISupportHistory[]): void {
    this.supportHistory = supportHistory;
  }

  /**
   * Busca un producto por su identificador único (Número de serie).
   */
  public searchProduct() {
    const serial = this.supportForm.get('search')?.value;
    this.productService.findOneSerial(serial).subscribe({
      next: (product: IProduct) => {
        if (!product) {
          this.messageService.add({
            severity: 'info',
            summary: `Info`,
            detail: 'Producto no encontrado',
          });
          return;
        }
        this.supportService.findAllByProduct(product.id).subscribe({
          next: (supports: ISupport[]) => {
            const supportActive = supports.find(
              (support) => support.state.id !== 12 && support.state.id !== 13
            );
            if (supportActive) {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Producto con soporte activo',
              });
              return;
            }
            this.supportForm.patchValue({
              client: product.client.taxpayerName,
              product: product.id,
              productType: product.productType.name,
              productDateEntry: new Date(product.deliveryDate),
              productSerial: product.serial,
            });
            this.calculateWarranty(product.deliveryDate);
          },
        });
      },
    });
  }

  /**
   * Envía el formulario del soporte para crear un nuevo registro o actualizar uno existente.
   * Determina si se debe llamar a la función de confirmación de creación o actualización del soporte.
   */
  public processSupportForm(): void {
    !this.config.data
      ? this.confirmCreateSupport()
      : this.confirmUpdateSupport();
  }

  /**
   * Crea un nuevo registro de soporte.
   * Muestra un diálogo de confirmación antes de realizar la operación.
   */
  public confirmCreateSupport(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea crear el registro?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      rejectLabel: 'CANCELAR',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-sm p-button-info',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
      accept: () =>
        this.supportService.create(this.getSupportData()).subscribe({
          next: () =>
            this.messageService.add({
              severity: 'success',
              summary: 'Operación exitosa',
              detail: 'El registro se creó correctamente',
            }),
          error: (err: HttpErrorResponse) => {
            if (err.status === 409) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El soporte ya existe',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al crear el soporte',
              });
            }
          },
          complete: () => this.ref.close(),
        }),
    });
  }

  /**
   * Actualiza el registro de soporte.
   * Muestra un diálogo de confirmación antes de realizar la operación.
   */
  public confirmUpdateSupport(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea actualizar el registro?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      rejectLabel: 'CANCELAR',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-sm p-button-info',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
      accept: () => {
        this.supportService
          .update(this.config.data.id, this.getSupportData())
          .subscribe({
            next: () =>
              this.messageService.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'El registro se actualizó correctamente',
              }),
            error: (err: HttpErrorResponse) => {
              if (err.status === 404) {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Soporte no encontrado',
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Ocurrió un error al actualizar el soporte',
                });
              }
            },
            complete: () => this.ref.close(),
          });
      },
    });
  }

  /**
   * Cierra el formulario de soportes.
   * Muestra un diálogo de confirmación antes de cerrar.
   */
  public closeSupportForm(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea salir del formulario?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      rejectLabel: 'CANCELAR',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-sm p-button-info',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
      accept: () => this.ref.close(),
    });
  }

  //Abre el formulario del historial de cambios de estado / notas
  public openHistoryForm(): void {
    if (
      this.config.data.state.id === 9 &&
      this.getLastUser(this.config.data).id ===
        Number(this.tokenService.getUserId())
    ) {
      this.confirmationService.confirm({
        message:
          'La actualización del estado no es posible con el mismo usuario.<br> Por favor, realice la acción con otro usuario.',
        header: 'INFORMACIÓN',
        icon: 'pi pi-info-circle',
        rejectVisible: false,
        acceptVisible: false,
        closeOnEscape: true,
      });
    } else if (
      this.config.data.state.id === 11 &&
      !this.tokenService.isAdmin()
    ) {
      this.confirmationService.confirm({
        message:
          'La actualización del estado no es posible.<br> Solo los administradores tienen permiso para cerrar el caso.',
        header: 'INFORMACIÓN',
        icon: 'pi pi-info-circle',
        rejectVisible: false,
        acceptVisible: false,
        closeOnEscape: true,
      });
    } else if (this.supportForm.invalid) {
      this.confirmationService.confirm({
        message:
          'No se puede actualizar el estado.<br> Complete los campos obligatorios pendientes.',
        header: 'INFORMACIÓN',
        icon: 'pi pi-info-circle',
        rejectVisible: false,
        acceptVisible: false,
        closeOnEscape: true,
      });
    } else {
      this.refHistory = this.dialogService.open(SupportFormHistoryComponent, {
        header: 'FORMULARIO DE ACTUALIZACIÓN DE ESTADO DEL SERVICIO',
        width: '50%',
        closable: false,
        closeOnEscape: false,
        dismissableMask: false,
        showHeader: true,
        position: 'center',
        data: this.config.data,
      });
    }

    this.refHistory.onClose.subscribe({
      next: () => {
        this.ref.close();
      },
    });
  }

  /**
   * Limpia el formulario de servicios.
   * Se aplica cuando se está creando un nuevo caso.
   */
  public cleanSupportForm(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea limpiar el formulario?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      rejectLabel: 'CANCELAR',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-sm p-button-info',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
      accept: () => {
        this.supportForm.reset({
          dateEntry: this.supportForm.get('dateEntry')?.value,
          reclaim: this.supportForm.get('reclaim')?.value,
          state: this.supportForm.get('state')?.value,
          priority: this.supportForm.get('priority')?.value,
        });
        this.messageService.add({
          severity: 'info',
          summary: 'Operación exitosa',
          detail: 'El formulario se limpió',
        });
      },
    });
  }

  /**
   * Calcula la garantía del producto.
   *
   * @param deliveryDate La fecha de entrega del producto.
   * @param isUpdate Indica si se está actualizando el formulario.
   */
  private calculateWarranty(
    deliveryDate: Date,
    isUpdate: boolean = false
  ): void {
    const oneYearLater = new Date(deliveryDate);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    const sixMonthsLater = new Date(oneYearLater);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

    let warrantyProductionStatus: string;
    let warrantyServiceStatus: string;
    let warranty: boolean;

    if (this.today <= oneYearLater) {
      warrantyProductionStatus = 'GARANTÍA DE PRODUCCIÓN VÁLIDA';
      warrantyServiceStatus = 'N/A';
      warranty = true;
    } else if (this.today <= sixMonthsLater) {
      warrantyProductionStatus = 'GARANTÍA DE PRODUCCIÓN VENCIDA';
      warrantyServiceStatus = 'GARANTÍA DE SERVICIO TÉCNICO VÁLIDA';
      warranty = true;
    } else {
      warrantyProductionStatus = 'GARANTÍA DE PRODUCCIÓN VENCIDA';
      warrantyServiceStatus = 'GARANTÍA DE SERVICIO TÉCNICO VENCIDA';
      warranty = false;
    }

    if (isUpdate) {
      this.supportForm.patchValue({
        warrantyProduction: warrantyProductionStatus,
        warrantyService: warrantyServiceStatus,
      });
    } else {
      this.supportForm.patchValue({
        warrantyProduction: warrantyProductionStatus,
        warrantyService: warrantyServiceStatus,
        warranty: warranty,
      });
    }
  }

  /**
   * Obtiene el último número de reclamo para agregarle +1 para un nuevo servicio.
   */
  private getLastReclaimNumber(): void {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    this.supportService.findLastReclaim().subscribe({
      next: (reclaimFound: string | null) => {
        const lastReclaimNumber = reclaimFound
          ? Number(reclaimFound.split('-').pop()) + 1
          : 1;
        this.supportForm
          .get('reclaim')
          ?.setValue(`CNET-${today}-${lastReclaimNumber}`);
      },
    });
  }

  /**
   * Obtiene los datos del formulario de soporte excluyendo ciertos campos.
   */
  private getSupportData(): ISupport {
    const {
      search,
      client,
      productType,
      warrantyProduction,
      warrantyService,
      ...support
    } = this.supportForm.getRawValue();
    return support;
  }

  /**
   * Realiza validaciones en el formulario de servicio.
   * @param controlName Nombre del control a validar.
   * @returns Devuelve true si el control es inválido y ha sido tocado o permanece sin cambios (pristine).
   */
  public validateSupportForm(controlName: string): boolean | undefined {
    const control = this.supportForm.get(controlName);
    return control?.invalid && (control?.touched || control?.pristine);
  }

  /**
   * Comprueba si el usuario no es administrador y modifica el estado de los campos en consecuencia.
   * Si el usuario no es administrador y el estado del caso no es 11, deshabilita los campos de prioridad y garantía.
   * Si el usuario no es administrador y el estado del caso es 11, deshabilita todo el formulario.
   */
  private fieldsWithoutAdmin(): void {
    const isAdmin = this.tokenService.isAdmin();
    const isCase11 = this.config.data?.state.id === 11;

    if (!isAdmin) {
      if (!this.config.data || !isCase11) {
        this.supportForm.get('priority')?.disable();
        this.supportForm.get('warranty')?.disable();
      } else {
        this.supportForm.disable();
      }
    }
  }

  /**
   * Comprueba los campos requeridos según el estado del servicio.
   * Habilita o deshabilita los campos en base al estado del servicio.
   * @param state El estado del servicio.
   */
  private requiredFieldsByState(state?: number): void {
    switch (state) {
      case 1:
        this.supportForm.get('securityStrap')?.enable();
        break;
      case 2:
      case 4:
      case 9:
        this.supportForm.disable();
        this.fieldsActive();
        break;
      case 3:
      case 6:
      case 8:
        this.supportForm.disable();
        this.supportForm.get('failureTypes')?.enable();
        this.fieldsActive();
        this.supportForm
          .get('failureTypes')
          ?.addValidators(Validators.required);
        this.supportForm.get('failureTypes')?.updateValueAndValidity();
        break;
      case 5:
        this.supportForm.disable();
        this.supportForm.get('quoteNumber')?.enable();
        this.supportForm.get('orderNumber')?.enable();
        this.fieldsActive();
        this.supportForm.get('quoteNumber')?.addValidators(Validators.required);
        this.supportForm.get('quoteNumber')?.updateValueAndValidity();
        this.supportForm.get('orderNumber')?.addValidators(Validators.required);
        this.supportForm.get('orderNumber')?.updateValueAndValidity();
        break;
      case 7:
        this.supportForm.disable();
        this.supportForm.get('quoteNumber')?.enable();
        this.supportForm.get('orderNumber')?.enable();
        this.fieldsActive();
        this.supportForm.get('quoteNumber')?.addValidators(Validators.required);
        this.supportForm.get('quoteNumber')?.updateValueAndValidity();
        this.supportForm.get('orderNumber')?.addValidators(Validators.required);
        this.supportForm.get('orderNumber')?.updateValueAndValidity();
        break;
      case 11:
        this.supportForm.disable();
        this.supportForm.get('failureTypes')?.enable();
        this.supportForm.get('quoteNumber')?.enable();
        this.supportForm.get('orderNumber')?.enable();
        this.supportForm.get('endReference')?.enable();
        this.supportForm.get('securityStrap')?.enable();
        this.fieldsActive();
        this.supportForm.get('quoteNumber')?.addValidators(Validators.required);
        this.supportForm.get('quoteNumber')?.updateValueAndValidity();
        this.supportForm.get('orderNumber')?.addValidators(Validators.required);
        this.supportForm.get('orderNumber')?.updateValueAndValidity();
        this.supportForm
          .get('failureTypes')
          ?.addValidators(Validators.required);
        this.supportForm.get('failureTypes')?.updateValueAndValidity();
        this.supportForm
          .get('endReference')
          ?.addValidators(Validators.required);
        this.supportForm.get('endReference')?.updateValueAndValidity();
        break;
      default:
        this.supportForm.disable();
        this.supportForm.get('search')?.enable();
        this.supportForm.get('dateEntry')?.enable();
        this.supportForm.get('securityStrap')?.enable();
        this.fieldsActive();
        break;
    }
  }

  /**
   * Comprueba si el formulario de servicios ha sido modificado por el usuario.
   * @returns true si se han realizado cambios en el formulario, de lo contrario false.
   */
  public getChangesToUpdate(): boolean {
    return !this.supportForm.pristine;
  }

  /**
   * Obtiene el último usuario del último cambio de estado del servicio.
   * @param support El servicio del cual se desea obtener el último usuario del cambio de estado.
   * @returns El último usuario del último cambio de estado del servicio.
   */

  private getLastUser(support: ISupport): any {
    const supportHistory = support.serviceHistory;
    return supportHistory[0].user;
  }

  /**
   * Activa los campos del formulario de servicios.
   */

  public fieldsActive() {
    this.supportForm.get('bitrixUrl')?.enable();
    this.supportForm.get('startReference')?.enable();
    this.supportForm.get('failure')?.enable();
    this.supportForm.get('remarks')?.enable();
    this.supportForm.get('warranty')?.enable();
    this.supportForm.get('priority')?.enable();
  }

  /**
   * Función que se activa al presionar la tecla Enter en el lector de códigos de barras de los productos.
   * Verifica si el valor ingresado cumple con el formato esperado y realiza la búsqueda del producto.
   * En caso de no cumplir con el formato, muestra un mensaje de error.
   * @param event El evento de teclado.
   */

  public onKeyPressEnter(event: Event) {
    const allowedCharacters = /^\d{0,4}(-\d{0,5})?$/;
    const inputValue = (event.target as HTMLInputElement).value;
    if (allowedCharacters.test(inputValue)) {
      this.searchProduct();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Info',
        detail: 'Número de serie invalido',
      });
    }
  }
}
