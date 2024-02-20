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
  public buttonLabel: string = 'REGISTRAR FORMULARIO';

  //Inicializador de funciones.
  ngOnInit(): void {
    if (this.config.data) {
      this.loadForm(this.config.data);
      this.buttonLabel = 'ACTUALIZAR FORMULARIO';
    }
  }

  //Construcción de los campos y validaciones del formulario de tipos de producto.
  private buildForm(): FormGroup {
    return this.formBuilder.group({
      prefix: [null, [Validators.required, Validators.maxLength(4)]],
      name: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9\s-()]+$/),
        ],
      ],
      description: [null, [Validators.maxLength(250)]],
    });
  }

  //Carga de datos para el formulario de tipos de producto.
  private loadForm(productType: IProductType): void {
    this.productTypeForm.patchValue(productType);
    if (this.productTypeForm.get('prefix')?.value === null) {
      this.productTypeForm.get('prefix')?.clearValidators();
      this.productTypeForm.get('prefix')?.disable();
    }
  }

  //Validaciones del formulario de tipos de producto
  public validateForm(controlName: string): boolean | undefined {
    return (
      this.productTypeForm.get(controlName)?.invalid &&
      this.productTypeForm.get(controlName)?.touched
    );
  }

  //Guarda o actualiza la información del tipo de producto.
  public submitForm(): void {
    if (!this.config.data) {
      this.createProductType();
    } else {
      this.updateProductType();
    }
  }

  //Cancela la operación del formulario.
  public cancelForm(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cancelar la operación?',
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

  //Guarda la información cargada en el tipo de producto. (nuevo)
  public createProductType(): void {
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
      accept: () => {
        this.productTypeService
          .create(this.productTypeForm.getRawValue())
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'Registro creado correctamente',
              });
              this.ref.close();
            },
          });
      },
    });
  }

  //Actualiza la información nueva en el tipo de producto.
  public updateProductType(): void {
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
        this.productTypeService
          .update(this.config.data.id, this.productTypeForm.getRawValue())
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'Registro actualizado correctamente',
              });
              this.ref.close();
            },
          });
      },
    });
  }

  //Obtiene si realmente el usuario modifico el formulario de tipos de producto.
  public getChangesToUpdate(): boolean {
    return !this.productTypeForm.pristine;
  }
}
