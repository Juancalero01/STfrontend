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
  public disabledChange: boolean = true;
  public booleanDropdown: any[] = [
    { value: true, label: 'Si' },
    { value: false, label: 'No' },
  ];
  public failureTypesDropdown: IFailureType[] = [];
  public supportStatesDropdown: ISupportState[] = [];
  public supportPrioritiesDropdown: ISupportPriority[] = [];
  public blockSpace: RegExp = /[^\s]/;

  //ref open history
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
    } else {
      this.getLastReclaimNumber();
    }
  }

  private setDefaultFormData(): void {
    const today = new Date().toISOString().split('T')[0];
    this.supportForm.get('state')?.setValue(1);
    this.supportForm.get('dateEntry')?.setValue(today);
  }

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
      failureType: [null],
      remarks: [null, [Validators.maxLength(255)]],
      product: [null, [Validators.required]],
      warranty: [null],
    });
  }

  private loadForm(data: ISupport) {
    this.supportForm.patchValue(data);
    this.supportForm.get('search')?.clearValidators();
    this.supportForm.get('state')?.setValue(data.state.id);
    this.supportForm.get('client')?.setValue(data.product.client.taxpayerName);
    this.supportForm
      .get('productType')
      ?.setValue(data.product.productType.name);
    this.supportForm.get('priority')?.setValue(data.priority.id);

    data.failureType
      ? this.supportForm.get('failureType')?.setValue(data.failureType.id)
      : null;
    this.calculateWarranty(data.product.deliveryDate);
    this.mainButtonLabel = 'ACTUALIZAR FORMULARIO';
  }

  private loadStates(): void {
    this.supportStateService.findAll().subscribe({
      next: (supportStates: ISupportState[]) => {
        this.supportStatesDropdown = supportStates;
      },
      error: (e: any) => {
        if (e.status === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error de conexión con el servidor',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al cargar los estados',
            detail: 'Error al cargar los estados',
          });
        }
      },
    });
  }

  private loadPriorities(): void {
    this.supportPriorityService.findAll().subscribe({
      next: (supportPriorities: ISupportPriority[]) => {
        this.supportPrioritiesDropdown = supportPriorities;
      },
      error: (e: any) => {
        if (e.status === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error de conexión con el servidor',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al cargar las prioridades',
            detail: 'Error al cargar las prioridades',
          });
        }
      },
    });
  }

  private loadFailureTypes(): void {
    this.failureTypeService.findAll().subscribe({
      next: (failureTypes: IFailureType[]) => {
        this.failureTypesDropdown = failureTypes;
      },
      error: (e: any) => {
        if (e.status === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error de conexión con el servidor',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al cargar los tipos de falla',
            detail: 'Error al cargar los tipos de falla',
          });
        }
      },
    });
  }

  public searchProduct() {
    const serial = this.supportForm.get('search')?.value;
    if (!serial || serial > 10) {
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

  public submitForm() {
    if (!this.config.data) this.createSupport();
    else this.updateForm();
  }

  public createSupport(): void {
    const { search, ...dataToSend } = this.supportForm.value;
    dataToSend.reclaim = this.supportForm.get('reclaim')?.value;
    dataToSend.state = this.supportForm.get('state')?.value;
    dataToSend.dateEntry = this.supportForm.get('dateEntry')?.value;

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
      accept: () => {
        this.supportService.create(dataToSend).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Operación exitosa',
              detail: 'El registro se creó correctamente',
            });
            this.ref.close();
          },
          error: (e: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al crear el registro',
              detail: 'Error al crear el registro',
            });
          },
          complete: () => {
            this.ref.close();
          },
        });
      },
    });
  }

  public updateForm(): void {
    const { search, ...dataToSend } = this.supportForm.value;
    dataToSend.state = this.supportForm.get('state')?.value;
    dataToSend.dateEntry = this.supportForm.get('dateEntry')?.value;
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
        this.supportService.update(this.config.data?.id, dataToSend).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Operación exitosa',
              detail: 'El registro se actualizó correctamente',
            });
          },
          error: (e: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al actualizar el registro',
              detail: 'Error al actualizar el registro',
            });
          },
          complete: () => {
            this.ref.close();
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Operación cancelada',
          detail: 'El registro no se actualizó',
        });
      },
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
        const state: ISupportState =
          this.supportStatesDropdown[this.supportStatesDropdown.length - 1];
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
      header: 'REGISTRO DE CAMBIO DE ESTADO',
      width: '50%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
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
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Operación cancelada',
          detail: 'El formulario no se limpió',
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
    this.supportService.findLastReclaim().subscribe({
      next: (reclaimFound: string) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const lastReclaimNumber = reclaimFound.split('-').pop();
        const reclaim = `CNET-${year}${month}${day}-${
          Number(lastReclaimNumber) + 1
        }`;
        this.supportForm.get('reclaim')?.setValue(reclaim);
      },
    });
  }
}
