import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IProductType } from 'src/app/demo/api/interfaces/product-type.interface';
import { ProductTypeService } from 'src/app/demo/api/services/product-type.service';

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
    private readonly formBuilder: FormBuilder,
    private readonly productTypeService: ProductTypeService
  ) {}

  public productTypeForm: FormGroup = this.buildForm();
  public buttonLabel: string = 'REGISTRAR';
  public blockSpace: RegExp = /[^\s]/;

  public ngOnInit(): void {
    if (this.config.data) this.loadForm(this.config.data);
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      prefix: [null, [Validators.required, Validators.maxLength(4)]],
      name: [null, [Validators.required, Validators.maxLength(100)]],
    });
  }

  private loadForm(productType: IProductType): void {
    this.productTypeForm.patchValue(productType);
    this.buttonLabel = 'ACTUALIZAR';
  }

  public validateForm(controlName: string): boolean | undefined {
    return (
      this.productTypeForm.get(controlName)?.invalid &&
      this.productTypeForm.get(controlName)?.touched
    );
  }

  public submitForm(): void {
    if (!this.config.data) this.createProductType();
    else this.updateProductType();
  }

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

  public createProductType(): void {
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
        this.productTypeService.create(this.productTypeForm.value).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Operación exitosa',
              detail: 'El registro se creó',
            });
          },
          error: (e: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Operación fallida',
              detail: 'El registro no se creó, compruebe los datos',
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
          detail: 'El registro no se creó',
        });
      },
    });
  }

  public updateProductType(): void {
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
        this.productTypeService
          .update(this.config.data?.id, this.productTypeForm.value)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'El registro se actualizó',
              });
            },
            error: (e: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Operación fallida',
                detail: 'El registro no se actualizó, compruebe los datos',
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
          summary: 'Opernación cancelada',
          detail: 'El registro no se actualizó',
        });
      },
    });
  }
}
