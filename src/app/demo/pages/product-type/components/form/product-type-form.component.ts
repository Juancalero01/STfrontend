import { HttpErrorResponse } from '@angular/common/http';
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

  public productTypeForm: FormGroup = this.buildProductTypeForm();
  public buttonLabel: string = 'REGISTRAR FORMULARIO';

  ngOnInit(): void {
    if (this.config.data) {
      this.loadProductTypeDataIntoForm(this.config.data);
      this.buttonLabel = 'ACTUALIZAR FORMULARIO';
    }
  }

  /**
   * Construye y devuelve un FormGroup para el formulario de tipos de producto.
   * Este FormGroup contiene controles para capturar la información del tipo de producto,
   * aplicando validaciones a cada campo según los requisitos especificados.
   */
  private buildProductTypeForm(): FormGroup {
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

  /**
   * Carga los datos del tipo de producto en el formulario correspondiente.
   * Utiliza los datos del producto proporcionados para completar los campos del formulario,
   * asignando los valores de los campos a partir de la información del tipo de producto.
   */
  private loadProductTypeDataIntoForm(productType: IProductType): void {
    this.productTypeForm.patchValue(productType);
    if (this.productTypeForm.get('prefix')?.value === null) {
      this.productTypeForm.get('prefix')?.clearValidators();
      this.productTypeForm.get('prefix')?.disable();
    }
  }

  /**
   * Valida un control específico del formulario del tipo de producto.
   * Comprueba si el control especificado es inválido y ha sido tocado.
   * @param controlName El nombre del control que se va a validar.
   * @returns Verdadero si el control es inválido y ha sido tocado, de lo contrario, indefinido.
   */
  public isFormControlInvalid(controlName: string): boolean | undefined {
    return (
      this.productTypeForm.get(controlName)?.invalid &&
      this.productTypeForm.get(controlName)?.touched
    );
  }

  /**
   * Envía el formulario del tipo de producto para crear un nuevo registro o actualizar uno existente.
   * Determina si se debe llamar a la función de confirmación de creación o actualización del producto.
   */
  public processProductTypeForm(): void {
    if (!this.config.data) {
      this.confirmCreateProductType();
    } else {
      this.confirmUpdateProductType();
    }
  }

  /**
   * Cierra el formulario de tipos de producto.
   * Muestra un diálogo de confirmación antes de cerrar.
   */
  public closeProductTypeForm(): void {
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

  /**
   * Crea un nuevo registro de tipo de producto.
   * Muestra un diálogo de confirmación antes de realizar la operación.
   */
  public confirmCreateProductType(): void {
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
            error: (err: HttpErrorResponse) => {
              if (err.status === 409) {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'El tipo de producto ya existe',
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Ocurrió un error al crear el tipo de producto',
                });
              }
            },
          });
      },
    });
  }

  /**
   * Actualiza el registro de tipo de producto.
   * Muestra un diálogo de confirmación antes de realizar la operación.
   */
  public confirmUpdateProductType(): void {
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
            error: (err: HttpErrorResponse) => {
              if (err.status === 404) {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Tipo de producto no encontrado',
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Ocurrió un error al actualizar el tipo de producto',
                });
              }
            },
          });
      },
    });
  }

  /**
   * Verifica si el usuario ha realizado modificaciones en el formulario de tipos de producto.
   * @returns true si el formulario ha sido modificado; de lo contrario, false.
   */
  public hasProductTypeFormChanged(): boolean {
    return !this.productTypeForm.pristine;
  }
}
