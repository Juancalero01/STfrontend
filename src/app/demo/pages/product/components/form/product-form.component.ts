import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { Client } from 'src/app/demo/api/interfaces/client.interface';
import { IProductType } from 'src/app/demo/api/interfaces/product-type.interface';
import { IProduct } from 'src/app/demo/api/interfaces/product.interface';
import { ClientService } from 'src/app/demo/api/services/client.service';
import { ProductTypeService } from 'src/app/demo/api/services/product-type.service';

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
    private readonly formBuilder: FormBuilder
  ) {}

  public productForm: FormGroup = this.buildForm();
  public buttonLabel: string = 'Registrar';
  public clientDropdown: any[] = [];
  public productTypeDropdown: IProductType[] = [];

  public ngOnInit(): void {
    this.clientDropdown = [];
    this.productTypeDropdown = this.productTypeService.findAll();
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

  public loadForm(product: IProduct): void {
    this.productForm.patchValue(product);
    this.productForm.get('client')?.setValue(product.client.id);
    this.productForm.get('productType')?.setValue(product.productType.id);
    this.buttonLabel = 'Actualizar';
  }

  public submitForm(): void {
    if (!this.config.data) this.createProduct();
    else this.updateProduct();
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
          summary: 'Operación exitosa',
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
          summary: 'Operación exitosa',
          detail: 'El registro se creó',
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
          summary: 'Operación exitosa',
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

  // TODO: Refactorizar
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
      this.productForm.get('serial')?.setValue(null);
    }
  }
}
