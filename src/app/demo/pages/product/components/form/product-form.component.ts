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
  public buttonLabel: string = 'REGISTRAR FORMULARIO';
  public clients: IClient[] = [];
  public productTypes: IProductType[] = [];
  public numberWithHyphen: RegExp = /^[0-9 -]*$/;
  public alphaNumberUppercase: RegExp = /^[A-Z0-9 -]*$/;
  public ngOnInit(): void {
    this.getClients();
    this.getProductTypes();

    if (this.config.data) this.loadForm(this.config.data);
  }

  public buildForm(): FormGroup {
    return this.formBuilder.group({
      client: [null, [Validators.required]],
      productType: [null, [Validators.required]],
      serial: ['', [Validators.required]],
      reference: [null],
      deliveryDate: [null, [Validators.required]],
    });
  }

  private loadForm(product: IProduct): void {
    this.productForm.patchValue({
      ...product,
      client: product.client.id,
      productType: product.productType.id,
      deliveryDate: new Date(product.deliveryDate),
    });
    this.buttonLabel = 'ACTUALIZAR FORMULARIO';
  }

  private getClients(): void {
    this.clientService.findAll().subscribe({
      next: (clients: IClient[]) => (this.clients = clients),
    });
  }

  private getProductTypes(): void {
    this.productTypeService.findAll().subscribe({
      next: (productTypes: IProductType[]) =>
        (this.productTypes = productTypes),
    });
  }

  public validateForm(controlName: string): boolean | undefined {
    return (
      this.productForm.get(controlName)?.invalid &&
      this.productForm.get(controlName)?.touched
    );
  }

  public submitForm(): void {
    !this.config.data ? this.createProduct() : this.updateProduct();
  }

  public closeForm(): void {
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

  public createProduct(): void {
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
              detail: 'El registro se creó',
            });
          },
          error: () => {},
          complete: () => this.ref.close(),
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
      rejectLabel: 'CANCELAR',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-sm p-button-info',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
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
            error: () => {},
            complete: () => this.ref.close(),
          });
      },
    });
  }

  public onProductTypeChange(): void {
    const productTypeId = this.productForm.get('productType')?.value;
    const productType = this.productTypes.find((productType) => {
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

  public getChangesToUpdate(): boolean {
    return !this.productForm.pristine;
  }
}
