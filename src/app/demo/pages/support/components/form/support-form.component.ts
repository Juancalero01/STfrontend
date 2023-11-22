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
    private readonly dialogService: DialogService
  ) {}

  public supportForm: FormGroup = this.buildForm();
  public mainButtonLabel: string = 'REGISTRAR FORMULARIO';
  public showButtonState: boolean = false;
  public showButtonClean: boolean = true;
  public showSearch: boolean = true;
  public showButtonCancel: boolean = true;
  public booleanDropdown: any[] = [
    { value: true, label: 'Si' },
    { value: false, label: 'No' },
  ];
  public failureTypes: IFailureType[] = [];
  public states: ISupportState[] = [];
  public priorities: ISupportPriority[] = [];
  public refHistory: DynamicDialogRef = new DynamicDialogRef();

  //TODO: REFACTORIZAR TODAY para no hacer nuevos objetos de date
  public today: Date = new Date();
  public minDate: Date = new Date(
    new Date().setMonth(new Date().getMonth() - 1)
  );
  public maxDate: Date = this.today;

  public ngOnInit() {
    this.setDefaultFormData();
    this.loadStates();
    this.loadPriorities();
    this.loadFailureTypes();
    if (this.config.data) {
      this.loadForm(this.config.data);
      this.showButtonState = true;
      this.showButtonClean = false;
      this.showSearch = false;
      this.config.data.state.id < 1 ? (this.showButtonCancel = true) : false;
    } else {
      this.getLastReclaimNumber();
    }
  }

  private setDefaultFormData(): void {
    this.supportForm.get('state')?.setValue(1);
    this.supportForm.get('dateEntry')?.setValue(this.today);
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      search: [null, [Validators.required]],
      warrantyProduction: [{ value: null, disabled: true }],
      warrantyService: [{ value: null, disabled: true }],
      client: [{ value: null, disabled: true }],
      productType: [{ value: null, disabled: true }],
      productDateEntry: [{ value: null, disabled: true }],
      productSerial: [{ value: null, disabled: true }],
      product: [null, [Validators.required]],
      dateEntry: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      reclaim: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      warranty: [null, [Validators.required]],
      startReference: [null, [Validators.maxLength(255)]],
      endReference: [null, [Validators.maxLength(255)]],
      orderNumber: [null, [Validators.maxLength(255)]],
      quoteNumber: [null, [Validators.maxLength(255)]],
      securityStrap: [null],
      failure: [null, [Validators.maxLength(255)]],
      failureTypes: [null],
      remarks: [null, [Validators.maxLength(500)]],
    });
  }

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
    this.calculateWarranty(support.product.deliveryDate);
    this.mainButtonLabel = 'ACTUALIZAR FORMULARIO';
  }

  private loadStates(): void {
    this.supportStateService.findAll().subscribe({
      next: (states: ISupportState[]) => (this.states = states),
    });
  }

  private loadPriorities(): void {
    this.supportPriorityService.findAll().subscribe({
      next: (priorities: ISupportPriority[]) => (this.priorities = priorities),
    });
  }

  private loadFailureTypes(): void {
    this.failureTypeService.findAll().subscribe({
      next: (failureTypes: IFailureType[]) =>
        (this.failureTypes = failureTypes),
    });
  }

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
              (support) => support.state.id !== 11 && support.state.id !== 12
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
              productDateEntry: product.deliveryDate,
              productSerial: product.serial,
            });
            this.calculateWarranty(product.deliveryDate, product.id);
          },
        });
      },
    });
  }

  public submitForm(): void {
    !this.config.data ? this.createSupport() : this.updateSupport();
  }

  public createSupport(): void {
    //! REFACTORIZADO POSIBLE SOLUCIÓN AL PROBLEMA DE LOS CAMPOS DESHABILITADOS
    this.confirmationService.confirm({
      message: '¿Está seguro que desea crear el registro?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'CANCELAR',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () =>
        this.supportService.create(this.getSupportData()).subscribe({
          next: () =>
            this.messageService.add({
              severity: 'success',
              summary: 'Operación exitosa',
              detail: 'El registro se creó correctamente',
            }),
          //TODO: Mostrar error cuando haya una falla de la API.
          error: () => {},
          complete: () => this.ref.close(),
        }),
      reject: () =>
        this.messageService.add({
          severity: 'info',
          summary: 'Operación cancelada',
          detail: 'El registro no se creó',
        }),
    });
  }

  public updateSupport(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea actualizar el registro?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'CANCELAR',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
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
      reject: () =>
        this.messageService.add({
          severity: 'info',
          summary: 'Operación cancelada',
          detail: 'El registro no se actualizó',
        }),
    });
  }

  public cancelForm(): void {
    // TODO : ADAPTAR PARA QUE SE PUEDA CANCELAR EL FORMULARIO
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cancelar el formulario?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'CANCELAR',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () => {
        this.supportService
          .updateState(this.config.data.id, this.states[this.states.length - 1])
          .subscribe({
            next: () =>
              this.messageService.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'El registro se canceló correctamente',
              }),
            error: () => {},
            complete: () => this.ref.close(),
          });
      },
      reject: () => {},
    });
  }

  public exitForm(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea salir del formulario?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'CANCELAR',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () => this.ref.close(),
    });
  }

  //TODO: REFACTORIZAR PARA QUE TAMBIEN LO PUEDA USAR EL CANCERLAR FORMULARIO
  public openHistoryForm(): void {
    // state?: ISupportState
    // const header = state
    //   ? 'FORMULARIO DE CANCELACIÓN DE SOPORTE TÉCNICO'
    //   : 'FORMULARIO DE ACTUALIZACIÓN DE ESTADO DEL SOPORTE TÉCNICO';

    // this.refHistory = this.dialogService.open(SupportFormHistoryComponent, {
    //   header: header,
    //   width: '50%',
    //   closable: false,
    //   closeOnEscape: false,
    //   dismissableMask: false,
    //   showHeader: true,
    //   position: 'center',
    //   data: this.config.data,
    // });

    this.refHistory = this.dialogService.open(SupportFormHistoryComponent, {
      header: 'ACTUALIZAR ESTADO DEL SERVICIO',
      width: '50%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: this.config.data,
    });

    this.refHistory.onClose.subscribe(() => {
      this.ref.close();
    });
  }

  public cleanForm(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea limpiar el formulario?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'CANCELAR',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () => {
        this.supportForm.reset({
          dateEntry: this.supportForm.get('dateEntry')?.value,
          reclaim: this.supportForm.get('reclaim')?.value,
          state: this.supportForm.get('state')?.value,
        });
        this.messageService.add({
          severity: 'info',
          summary: 'Operación exitosa',
          detail: 'El formulario se limpió',
        });
      },
    });
  }

  //TODO: REFACTORIZAR PARA QUE TAMBIEN OBTENGA EL HISTORIAL DE ESE SERVICIO
  private calculateWarranty(deliveryDate: Date, id?: number): void {
    const oneYearLater = new Date(deliveryDate);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    const sixMonthsLater = new Date(oneYearLater);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

    if (this.today >= oneYearLater) {
      this.supportForm.patchValue({
        warrantyProduction: 'GARANTÍA DE PRODUCCIÓN VENCIDA',
      });
      if (this.today <= sixMonthsLater) {
        this.supportForm.patchValue({
          warrantyService: 'GARANTÍA DE SERVICIO TÉCNICO VÁLIDA',
        });
      } else {
        this.supportForm.patchValue({
          warrantyService: 'GARANTÍA DE SERVICIO TÉCNICO VENCIDA',
        });
      }
    } else {
      this.supportForm.patchValue({
        warrantyProduction: 'GARANTÍA DE PRODUCCIÓN VÁLIDA',
      });
      this.supportForm.patchValue({ warrantyService: 'N/A' });
    }

    // this.supportService.findAllByProduct(id!).subscribe({
    //   next: (supports: ISupport[]) => {
    //     if (supports.length === 0) {
    //       //!posible eliminación
    //       this.calculateDateWarranty(this.today, oneYearLater, sixMonthsLater);
    //     } else {
    //       this.supportForm.patchValue({
    //         warrantyProduction: 'GARANTÍA DE PRODUCCIÓN VENCIDA',
    //       });
    //       this.supportForm.patchValue({
    //         warrantyService: 'GARANTÍA DE SERVICIO TÉCNICO VENCIDA',
    //       });
    //     }
    //   },
    // });
  }

  // private calculateDateWarranty(
  //   today: Date,
  //   oneYearLater: Date,
  //   sixMonthsLater: Date
  // ): void {
  //   if (today >= oneYearLater) {
  //     this.supportForm.patchValue({
  //       warrantyProduction: 'GARANTÍA DE PRODUCCIÓN VENCIDA',
  //     });
  //     if (today <= sixMonthsLater) {
  //       this.supportForm.patchValue({
  //         warrantyService: 'GARANTÍA DE SERVICIO TÉCNICO VÁLIDA',
  //       });
  //     } else {
  //       this.supportForm.patchValue({
  //         warrantyService: 'GARANTÍA DE SERVICIO TÉCNICO VENCIDA',
  //       });
  //     }
  //   } else {
  //     this.supportForm.patchValue({
  //       warrantyProduction: 'GARANTÍA DE PRODUCCIÓN VÁLIDA',
  //     });
  //     this.supportForm.patchValue({ warrantyService: 'N/A' });
  //   }
  // }

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

  //TODO: REFACTORIZAR YA QUE NO CUMPLE CON EL REQUERIMIENTO, QUE DEBE SER QUE EN LA ETIQUETA SMALL SE MUESTRE EL ERROR POR EL CUAL NO SE PUEDE CREAR EL SOPORTE
  public validateForm(controlName: string): boolean | undefined {
    return (
      this.supportForm.get(controlName)?.invalid &&
      this.supportForm.get(controlName)?.touched
    );
  }
}
