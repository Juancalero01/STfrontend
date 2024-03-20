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
  public supportForm: FormGroup = this.buildForm();
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

  //Inicializador de funciones.
  ngOnInit() {
    this.requiredFieldsByState();
    this.fieldsWithoutAdmin();
    this.setDefaultFormData();
    this.loadStates();
    this.loadPriorities();
    this.loadFailureTypes();
    if (this.config.data) {
      this.loadForm(this.config.data);
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

  //Obtiene los datos importantes para añadirlos al formulario de servicios, esto se hace de forma oculta (El usuario no lo debe cargar)
  private setDefaultFormData(): void {
    this.supportForm.get('state')?.setValue(1);
    this.supportForm.get('dateEntry')?.setValue(this.today);
    this.supportForm.get('priority')?.setValue(4);
  }

  //Construcción de los campos y validaciones del formulario de servicios.
  private buildForm(): FormGroup {
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

  //Carga de datos para el formulario de servicios.
  private loadForm(support: ISupport) {
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

  //Obtiene todos los estados, esto es para que cargue en que estado se encuentra el servicio.
  private loadStates(): void {
    this.supportStateService.findAll().subscribe({
      next: (states: ISupportState[]) => (this.states = states),
    });
  }

  //Obtiene todas las prioridades, esto es para que cargue en que prioridad se encuentra el servicio.
  private loadPriorities(): void {
    this.supportPriorityService.findAll().subscribe({
      next: (priorities: ISupportPriority[]) => {
        this.priorities = priorities;
      },
    });
  }

  //Obtiene todos los tipos de fallas para mostrar y realizar el seleccionado correspondiente.
  private loadFailureTypes(): void {
    this.failureTypeService.findAll().subscribe({
      next: (failureTypes: IFailureType[]) =>
        (this.failureTypes = failureTypes),
    });
  }

  //Carga el historial de cambios de estado, en la otra pestaña del formulario.
  private loadSupportHistory(supportHistory: ISupportHistory[]): void {
    this.supportHistory = supportHistory;
  }

  //Busca el producto por su identificador unico (Número de serie).
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

  //Guarda o actualiza la información del servicio.
  public submitForm(): void {
    !this.config.data ? this.createSupport() : this.updateSupport();
  }

  //Guarda la información cargada en el servicio. (nuevo)
  public createSupport(): void {
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
          error: () => {},
          complete: () => this.ref.close(),
        }),
    });
  }

  //Actualiza la información nueva en el servicio.
  public updateSupport(): void {
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
            error: () => {},
            complete: () => this.ref.close(),
          });
      },
    });
  }

  //Cierra el formulario.
  public exitForm(): void {
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

  //Limpia el formulario de servicios, esto se aplica cuando esta creando un nuevo caso.
  public cleanForm(): void {
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

  //Calcula la garantia del producto.
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

  //Obtiene el ultimo número de reclamo para agregarle +1 para un nuevo servicio.
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

  //Obtiene datos del soportes que son importantes para el guardado o actualizado del servicio.
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

  //Validaciones del formulario del servicio.
  public validateForm(controlName: string): boolean | undefined {
    const control = this.supportForm.get(controlName);
    return control?.invalid && (control?.touched || control?.pristine);
  }

  //Comprueba si no es administrador, entonces modifica el evento de deshabilitado o habilitado
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

  //Comprueba que se requiere campos según el campo en el que se encuentre el servicio.
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
      // case 10:
      //   this.supportForm.disable();
      //   this.supportForm.get('endReference')?.enable();
      //   this.fieldsActive();
      //   this.supportForm
      //     .get('endReference')
      //     ?.addValidators(Validators.required);
      //   this.supportForm.get('endReference')?.updateValueAndValidity();
      //   break;
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

  //Obtiene si realmente el usuario modifico el formulario de servicios.
  public getChangesToUpdate(): boolean {
    return !this.supportForm.pristine;
  }

  //Obtiene el ultimo usuario del ultimo cambio de estado de servicios.
  private getLastUser(support: ISupport): any {
    const supportHistory = support.serviceHistory;
    return supportHistory[0].user;
  }

  //Campos activos.
  public fieldsActive() {
    this.supportForm.get('bitrixUrl')?.enable();
    this.supportForm.get('startReference')?.enable();
    this.supportForm.get('failure')?.enable();
    this.supportForm.get('remarks')?.enable();
    this.supportForm.get('warranty')?.enable();
    this.supportForm.get('priority')?.enable();
  }
}
