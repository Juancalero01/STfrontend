import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IProduct } from 'src/app/demo/api/interfaces/product.interface';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';

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
    private readonly formBuilder: FormBuilder
  ) {}

  public supportForm: FormGroup = this.buildForm();
  public buttonLabel: string = 'REGISTRAR';
  public productFinded!: IProduct;
  public securityStrapDropdown: any = [
    { value: true, label: 'Si' },
    { value: false, label: 'No' },
  ];

  public ngOnInit() {
    // load states
    // load priorities
    if (this.config.data) {
      this.loadForm(this.config.data);
    }
  }

  private buildForm(): FormGroup {
    let dateDay = new Date().toLocaleDateString();
    return this.formBuilder.group({
      reclaim: [
        { value: 'CNET-20230101-100', disabled: true },
        [Validators.maxLength(255)],
      ],
      failure: [null, [Validators.maxLength(255)]],
      reference: [null, [Validators.maxLength(255)]],
      remarks: [null, [Validators.maxLength(255)]],
      dateEntry: [{ value: dateDay, disabled: true }, [Validators.required]],
      warranty: [null],
      product: [null],
      state: [
        { value: 'ENVIADO A CONTROLNET', disabled: true },
        [Validators.required],
      ],
      priority: [null],
    });
  }

  private loadForm(data: ISupport) {
    this.supportForm.patchValue(data);
    this.buttonLabel = 'ACTUALIZAR';
  }

  // load states/priorities
  // private loadStates() {}
  // private loadPriorities() {}

  // search product
  public searchProduct() {
    // implement search product with service.
  }

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
