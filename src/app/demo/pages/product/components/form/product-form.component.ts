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

  public productForm: FormGroup = this.buildForm();
  public buttonLabel: string = 'REGISTRAR';
  public clientDropdown: IClient[] = [];
  public productTypeDropdown: IProductType[] = [];

  public ngOnInit(): void {
    this.loadDropdowns();
    if (this.config.data) this.loadForm(this.config.data);
  }

  public buildForm(): FormGroup {
    return this.formBuilder.group({
      client: ['', [Validators.required]],
      productType: ['', [Validators.required]],
      serial: ['', [Validators.required]],
      reference: [''],
      deliveryDate: ['', [Validators.required]],
    });
  }

  private loadForm(product: IProduct): void {
    this.productForm.patchValue(product);
    this.productForm.get('client')?.setValue(product.client.id);
    this.productForm.get('productType')?.setValue(product.productType.id);
    this.productForm
      .get('deliveryDate')
      ?.setValue(new Date(product.deliveryDate));
    this.buttonLabel = 'ACTUALIZAR';
  }

  private loadDropdowns(): void {
    this.clientService.findAll().subscribe({
      next: (clients: IClient[]) => {
        this.clientDropdown = clients;
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
            summary: 'Error',
            detail: 'Error al cargar los clientes',
          });
        }
      },
    });

    this.productTypeService.findAll().subscribe({
      next: (productTypes: IProductType[]) => {
        this.productTypeDropdown = productTypes;
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
            summary: 'Error',
            detail: 'Error al cargar los tipos de productos',
          });
        }
      },
    });
  }

  public validateForm(controlName: string): boolean | undefined {
    return (
      this.productForm.get(controlName)?.invalid &&
      this.productForm.get(controlName)?.touched
    );
  }

  public submitForm(): void {
    if (!this.config.data) this.createProduct();
    else this.updateProduct();
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

  public createProduct(): void {
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
        this.productService.create(this.productForm.value).subscribe({
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

  public updateProduct(): void {
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
        this.productService
          .update(this.config.data?.id, this.productForm.value)
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

  public onProductTypeChange(): void {
    const productTypeId = this.productForm.get('productType')?.value;
    const productType = this.productTypeDropdown.find((productType) => {
      return (
        productType.id === productTypeId &&
        productType.prefix !== null &&
        productType.prefix !== undefined
      );
    });

    if (productType) {
      const currentSerialValue = this.productForm.get('serial')?.value;
      const newSerialValue = `${productType.prefix}-${
        currentSerialValue.split('-')[1] || ''
      }`;
      this.productForm.get('serial')?.setValue(newSerialValue);
    } else {
      this.productForm.get('serial')?.setValue('');
    }
  }
}
