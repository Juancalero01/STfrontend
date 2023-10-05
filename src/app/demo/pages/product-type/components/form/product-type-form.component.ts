import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IProductType } from 'src/app/demo/api/interfaces/product-type.interface';

@Component({
  selector: 'app-product-type-form',
  templateUrl: './product-type-form.component.html',
})
export class ProductTypeFormComponent {
  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly formBuilder: FormBuilder
  ) {}

  public productTypeForm: FormGroup = this.buildForm();
  public buttonLabel: string = 'Registrar';

  public ngOnInit(): void {
    if (this.config.data) this.loadForm(this.config.data);
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      prefix: [null, [Validators.required, Validators.maxLength(4)]],
      name: [null, [Validators.required, Validators.maxLength(100)]],
    });
  }

  public loadForm(productType: IProductType): void {
    this.productTypeForm.patchValue(productType);
    this.buttonLabel = 'Actualizar';
  }

  public submitForm(): void {
    if (!this.config.data) this.createProductType();
    else this.updateProductType();
  }

  public cancelForm(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cancelar la operación?',
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Confirmar',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () => {
        this.ref.close();
        this.messageService.add({
          severity: 'success',
          summary: 'Operación cancelada',
          detail: 'La operación se canceló correctamente',
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

  public createProductType(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea crear el registro?',
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Confirmar',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () => {
        this.ref.close();
        this.messageService.add({
          severity: 'success',
          summary: 'Registro creado',
          detail: 'El registro se creó correctamente',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Operación cancelada',
          detail: 'El registro no se creó',
        });
      },
    });
  }

  public updateProductType(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea actualizar el registro?',
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Confirmar',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () => {
        this.ref.close();
        this.messageService.add({
          severity: 'success',
          summary: 'Registro actualizado',
          detail: 'El registro se actualizó correctamente',
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

  public validateInput(controlName: string): boolean | undefined {
    const control = this.productTypeForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched);
  }
}
