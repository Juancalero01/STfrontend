import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IClient } from 'src/app/demo/api/interfaces/client.interface';
import { IProductType } from 'src/app/demo/api/interfaces/product-type.interface';
import { IProduct } from 'src/app/demo/api/interfaces/product.interface';
import { ClientService } from 'src/app/demo/api/services/client.service';
import { ProductTypeService } from 'src/app/demo/api/services/product-type.service';
import { ProductService } from 'src/app/demo/api/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent {
  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly clientService: ClientService,
    private readonly productTypeService: ProductTypeService,
    private readonly productService: ProductService,
    private readonly formBuilder: FormBuilder
  ) {}

  public productForm: FormGroup = this.buildProductForm();
  public buttonLabel: string = 'REGISTRAR FORMULARIO';
  public clients: IClient[] = [];
  public productTypes: IProductType[] = [];

  ngOnInit(): void {
    this.getClients();
    this.getProductTypes();
    if (this.config.data) {
      this.loadProductDataIntoForm(this.config.data);
      this.buttonLabel = 'ACTUALIZAR FORMULARIO';
    }
  }

  /**
   * Construye y devuelve un FormGroup para el formulario de productos.
   * Este FormGroup contiene controles para capturar la información del producto,
   * aplicando validaciones a cada campo según los requisitos especificados.
   */
  public buildProductForm(): FormGroup {
    return this.formBuilder.group({
      client: [null, [Validators.required]],
      productType: [null, [Validators.required]],
      serial: [
        null,
        [Validators.required, Validators.pattern(/^\d{1,4}(-\d{4,5})?$/)],
      ],
      reference: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[0-9]{4}-R-[0-9]{8}$/),
          Validators.minLength(15),
        ],
      ],
      deliveryDate: [null, [Validators.required]],
    });
  }

  /**
   * Carga los datos del producto en el formulario correspondiente.
   * Utiliza los datos del producto proporcionados para completar los campos del formulario,
   * asignando los valores de los campos a partir de la información del producto.
   */
  private loadProductDataIntoForm(product: IProduct): void {
    this.productForm.patchValue({
      ...product,
      client: product.client.id,
      productType: product.productType.id,
      deliveryDate: new Date(product.deliveryDate),
    });
  }

  /**
   * Obtiene los clientes desde el servicio correspondiente y las asigna al dropdown correspondiente.
   * Los clientes se utilizan para llenar opciones en un dropdown de selección en el formulario del producto.
   */
  private getClients(): void {
    this.clientService.findAll().subscribe({
      next: (clients: IClient[]) => (this.clients = clients),
    });
  }

  /**
   * Obtiene los tipos de producto desde el servicio correspondiente y las asigna al dropdown correspondiente.
   * Los tipos de producto se utilizan para llenar opciones en un dropdown de selección en el formulario del producto.
   */
  private getProductTypes(): void {
    this.productTypeService.findAll().subscribe({
      next: (productTypes: IProductType[]) =>
        (this.productTypes = productTypes),
    });
  }

  /**
   * Valida un control específico del formulario del producto.
   * Comprueba si el control especificado es inválido y ha sido tocado.
   * @param controlName El nombre del control que se va a validar.
   * @returns Verdadero si el control es inválido y ha sido tocado, de lo contrario, indefinido.
   */
  public isFormControlInvalid(controlName: string): boolean | undefined {
    return (
      this.productForm.get(controlName)?.invalid &&
      this.productForm.get(controlName)?.touched
    );
  }

  /**
   * Envía el formulario del producto para crear un nuevo registro o actualizar uno existente.
   * Determina si se debe llamar a la función de confirmación de creación o actualización del producto.
   */
  public processProductForm(): void {
    if (!this.config.data) {
      this.confirmCreateProduct();
    } else {
      this.confirmUpdateProduct();
    }
  }

  /**
   * Cierra el formulario de productos.
   * Muestra un diálogo de confirmación antes de cerrar.
   */
  public closeProductForm(): void {
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
   * Crea un nuevo registro de producto.
   * Muestra un diálogo de confirmación antes de realizar la operación.
   */
  public confirmCreateProduct(): void {
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
        this.productService.create(this.productForm.value).subscribe({
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
                detail: 'El producto ya existe',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al crear el producto',
              });
            }
          },
        });
      },
    });
  }

  /**
   * Actualiza el registro de producto.
   * Muestra un diálogo de confirmación antes de realizar la operación.
   */
  public confirmUpdateProduct(): void {
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
        this.productService
          .update(this.config.data.id, this.productForm.value)
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
                  detail: 'Producto no encontrado',
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Ocurrió un error al actualizar el producto',
                });
              }
            },
          });
      },
    });
  }

  /**
   * Actualiza el número de serie del producto según el tipo de producto seleccionado.
   */
  public onProductTypeChange(): void {
    const productTypeId = this.productForm.get('productType')?.value;
    const productType = this.productTypes.find(
      (type) =>
        type.id === productTypeId &&
        type.prefix !== null &&
        type.prefix !== undefined
    );
    if (productType) {
      const currentSerialValue = this.productForm.get('serial')?.value;
      const newSerialValue =
        currentSerialValue !== null
          ? `${productType.prefix}-${currentSerialValue.split('-')[1] || ''}`
          : `${productType.prefix}-`;
      this.productForm.get('serial')?.setValue(newSerialValue);
    } else {
      this.productForm.get('serial')?.setValue(null);
    }
  }

  /**
   * Verifica si el usuario ha realizado modificaciones en el formulario de productos.
   * @returns true si el formulario ha sido modificado; de lo contrario, false.
   */
  public hasProductFormChanged(): boolean {
    return !this.productForm.pristine;
  }
}
