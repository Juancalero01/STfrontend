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
  public showButtonCancel!: boolean;
  public booleanDropdown: any[] = [
    { value: true, label: 'Si' },
    { value: false, label: 'No' },
  ];
  public failureTypes: IFailureType[] = [];
  public states: ISupportState[] = [];
  public priorities: ISupportPriority[] = [];
  public blockSpace: RegExp = /[^\s]/;
  public refHistory: DynamicDialogRef = new DynamicDialogRef();

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
      this.config.data.state.id < 3 ? (this.showButtonCancel = true) : false; //TODO: Arreglar dependiendo el tipo de estado ya que puede estar en espera de cotización o en espera de aprobación
    } else {
      this.getLastReclaimNumber();
    }
  }

  private setDefaultFormData(): void {
    const today = new Date().toISOString().split('T')[0];
    this.supportForm.get('state')?.setValue(1);
    this.supportForm.get('dateEntry')?.setValue(today);
  }

  //TODO: REFACTORIZAR
  private buildForm(): FormGroup {
    return this.formBuilder.group({
      search: [null, [Validators.required]],
      productType: [{ value: null, disabled: true }],
      client: [{ value: null, disabled: true }],
      warrantyProduction: [{ value: null, disabled: true }],
      warrantyService: [{ value: null, disabled: true }],
      dateEntry: [{ value: null, disabled: true }],
      reclaim: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      priority: [null, [Validators.required]],
      reference: [null, [Validators.maxLength(255)]],
      securityStrap: [null],
      failure: [null, [Validators.maxLength(255)]],
      failureTypes: [null],
      remarks: [null, [Validators.maxLength(255)]],
      product: [null, [Validators.required]],
      warranty: [null],
    });
  }

  private loadForm(data: ISupport) {
    console.log(data);
    this.supportForm.patchValue(data);
    this.supportForm.get('search')?.clearValidators();
    this.supportForm.get('state')?.setValue(data.state.id);
    this.supportForm.get('client')?.setValue(data.product.client.taxpayerName);
    this.supportForm
      .get('productType')
      ?.setValue(data.product.productType.name);
    this.supportForm.get('priority')?.setValue(data.priority.id);
    this.supportForm
      .get('failureTypes')
      ?.setValue(data.failureTypes.map((failureType) => failureType.id));
    this.calculateWarranty(data.product.deliveryDate);
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
    if (!serial || serial < 3) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al buscar el producto',
        detail: 'Debe ingresar un serial',
      });
      return;
    }
    this.productService.findOneSerial(serial).subscribe({
      next: (product: IProduct) => {
        this.supportService.findAll().subscribe({
          next: (supports: ISupport[]) => {
            const supportFound = supports.find(
              (support) =>
                support.product.id === product.id &&
                support.state.id !== 8 &&
                support.state.id !== 9
            );
            if (supportFound) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error al buscar el producto',
                detail: 'El producto ya tiene un soporte activo',
              });
              this.supportForm.reset({
                dateEntry: this.supportForm.get('dateEntry')?.value,
                reclaim: this.supportForm.get('reclaim')?.value,
                state: this.supportForm.get('state')?.value,
              });
            } else {
              this.supportForm.patchValue({
                product: product.id,
                productType: product.productType.name,
                client: product.client.taxpayerName,
              });
              this.calculateWarranty(product.deliveryDate);
            }
          },
        });
      },
      error: (e: any) => {
        if (e.status === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al buscar el producto',
            detail: 'Error de conexión con el servidor',
          });
        }
        if (e.status === 404) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al buscar el producto',
            detail: 'No se encontró el producto',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al buscar el producto',
            detail: 'Error al buscar el producto',
          });
        }
      },
    });
  }

  public validateForm(controlName: string): boolean | undefined {
    return (
      this.supportForm.get(controlName)?.invalid &&
      this.supportForm.get(controlName)?.touched
    );
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
        const state: ISupportState = this.states[this.states.length - 1];
        this.supportService
          .update(this.config.data?.id, { ...this.config.data, state })
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'El registro se canceló correctamente',
              });
            },
            error: (e: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error al cancelar el registro',
                detail: 'Error al cancelar el registro',
              });
            },
            complete: () => {
              this.ref.close();
            },
          });
      },
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

  public openHistoryForm(): void {
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

  private calculateWarranty(deliveryDate: Date): void {
    const today = new Date();

    const oneYearLater = new Date(deliveryDate);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    if (today >= oneYearLater) {
      this.supportForm.patchValue({
        warrantyProduction: 'GARANTÍA DE PRODUCCIÓN VENCIDA',
      });

      const sixMonthsLater = new Date(oneYearLater);
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

      if (today <= sixMonthsLater) {
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
  }

  private getLastReclaimNumber(): void {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    this.supportService.findLastReclaim().subscribe({
      next: (reclaimFound: string | null) => {
        if (!reclaimFound) {
          this.supportForm.get('reclaim')?.setValue(`CNET-${today}-1`);
          return;
        }
        const lastReclaimNumber = reclaimFound.split('-').pop();
        const reclaim = `CNET-${today}-${Number(lastReclaimNumber) + 1}`;
        this.supportForm.get('reclaim')?.setValue(reclaim);
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
}
