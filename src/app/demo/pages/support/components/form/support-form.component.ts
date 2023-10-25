import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
    private readonly supportService: SupportService
  ) {}

  public supportForm: FormGroup = this.buildForm();
  public buttonLabel: string = 'REGISTRAR';
  public showButtonState: boolean = false;
  public showButtonClean: boolean = true;
  public showSearch: boolean = true;

  public booleanDropdown: any[] = [
    { value: true, label: 'Si' },
    { value: false, label: 'No' },
  ];

  public failureTypesDropdown: IFailureType[] = [];
  public supportStatesDropdown: ISupportState[] = [];
  public supportPrioritiesDropdown: ISupportPriority[] = [];

  public blockSpace: RegExp = /[^\s]/;

  public ngOnInit() {
    this.loadStates();
    this.loadPriorities();
    this.loadFailureTypes();
    // this.loadReclaimNumber();
    if (this.config.data) {
      this.loadForm(this.config.data);
      this.showButtonState = true;
      this.showButtonClean = false;
      this.showSearch = false;
    }
  }

  private buildForm(): FormGroup {
    let dateDay = new Date().toISOString().slice(0, 10);
    return this.formBuilder.group({
      search: [null, [Validators.required]],
      productType: [{ value: null, disabled: true }],
      client: [{ value: null, disabled: true }],
      warrantyProduction: [{ value: null, disabled: true }],
      warrantyService: [{ value: null, disabled: true }],
      dateEntry: [{ value: dateDay, disabled: true }],
      reclaim: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      priority: [null],
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
    this.buttonLabel = 'ACTUALIZAR';
  }

  private loadStates(): void {
    this.supportStateService.findAll().subscribe({
      next: (supportStates: ISupportState[]) => {
        this.supportStatesDropdown = supportStates;
        this.supportForm.patchValue({ state: supportStates[0].id });
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

  // private loadReclaimNumber(): void {
  //   this.supportService.findLastReclaimNumber().subscribe({
  //     next: (reclaim: string) => {
  //       this.generateReclaimNumber(reclaim);
  //     },
  //     error: (e: any) => {
  //       if (e.status === 404) {
  //         this.generateReclaimNumber();
  //       } else {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error al cargar el número de reclamo',
  //           detail: 'Error al cargar el número de reclamo',
  //         });
  //       }
  //     },
  //   });
  // }

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
        this.supportForm.patchValue({
          product: product.id,
          productType: product.productType.name,
          client: product.client.taxpayerName,
        });

        const deliveryDate = new Date(product.deliveryDate);
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
    dataToSend.reclaim = `CNET-20231025-3`;
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
        console.log(dataToSend);
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

  public updateForm(): void {}

  public cancelForm(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cancelar la operación?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'CANCELAR',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () => {
        this.ref.close();
        this.messageService.add({
          severity: 'info',
          summary: 'Operación cancelada',
          detail: 'La operación se canceló',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Operación cancelada',
          detail: 'La operación no se canceló',
        });
      },
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

  // private generateReclaimNumber(reclaimNumber?: string): void {
  //   const dateDay = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  //   if (reclaimNumber) {
  //     const reclaimLastNumber = parseInt(reclaimNumber.split('-')[1]);
  //     const reclaimNewNumber = reclaimLastNumber + 1;
  //     this.supportForm.patchValue({
  //       reclaim: `CNET-${dateDay}-${reclaimNewNumber}`,
  //     });
  //   } else {
  //     this.supportForm.patchValue({
  //       reclaim: `CNET-${dateDay}-${1}`,
  //     });
  //   }
  // }

  // private converDateForMySQL(date: Date): string {
  //   return date.toISOString().slice(0, 10).replace(/-/g, '-');
  // }
}
