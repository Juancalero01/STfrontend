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
import { SupportPriorityService } from 'src/app/demo/api/services/support-priority.service';
import { SupportStateService } from 'src/app/demo/api/services/support-state.service';

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
    private readonly supportPriorityService: SupportPriorityService
  ) {}

  public supportForm: FormGroup = this.buildForm();
  public buttonLabel: string = 'REGISTRAR';
  public productFinded!: IProduct;
  public securityStrapDropdown: any[] = [
    { value: true, label: 'Si' },
    { value: false, label: 'No' },
  ];
  public failureTypesDropdown: IFailureType[] = [];
  public supportStatesDropdown: ISupportState[] = [];
  public supportPrioritiesDropdown: ISupportPriority[] = [];

  public ngOnInit() {
    this.loadStates();
    this.loadPriorities();
    this.loadFailureTypes();
    if (this.config.data) {
      this.loadForm(this.config.data);
    }
  }

  private buildForm(): FormGroup {
    let dateDay = new Date().toLocaleDateString();
    return this.formBuilder.group({
      dateEntry: [{ value: dateDay, disabled: true }],
      reclaim: [{ value: 'CNET-20230101-100', disabled: true }],
      state: [{ value: 'ENVIADO A CONTROLNET', disabled: true }],
      failure: [null, [Validators.maxLength(255)]],
      reference: [null, [Validators.maxLength(255)]],
      remarks: [null, [Validators.maxLength(255)]],
      warranty: [null],
      product: [null],
      priority: [null],
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
      },
      error: (e: Error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar los estados',
          detail: e.message,
        });
      },
    });
  }
  private loadPriorities(): void {
    this.supportPriorityService.findAll().subscribe({
      next: (supportPriorities: ISupportPriority[]) => {
        this.supportPrioritiesDropdown = supportPriorities;
      },
      error: (e: Error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar las prioridades',
          detail: e.message,
        });
      },
    });
  }

  private loadFailureTypes(): void {
    this.failureTypeService.findAll().subscribe({
      next: (failureTypes: IFailureType[]) => {
        this.failureTypesDropdown = failureTypes;
      },
      error: (e: Error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar los tipos de falla',
          detail: e.message,
        });
      },
    });
  }
  // TODO: Implementar la logica de busqueda de productos
  public searchProduct() {}

  public validateForm(controlName: string): boolean | undefined {
    return (
      this.supportForm.get(controlName)?.invalid &&
      this.supportForm.get(controlName)?.touched
    );
  }

  public submitForm() {
    if (!this.config.data) this.createForm();
    else this.updateForm();
  }

  public createForm(): void {}

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
  // 1. añadir logica para el create
  // 2. añadir logica para el update
  // 3. añadir logica para pintar de colores por prioridad
  // 4. añadir logica para pintar de colores por estado
}
