import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { IProductType } from 'src/app/demo/api/interfaces/product-type.interface';
import { IProduct } from 'src/app/demo/api/interfaces/product.interface';
import { ClientService } from 'src/app/demo/api/services/client.service';
import { ProductTypeService } from 'src/app/demo/api/services/product-type.service';
import { ProductService } from 'src/app/demo/api/services/product.service';
import { ProductFormComponent } from '../form/product-form.component';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
})
export class ProductTableComponent {
  constructor(
    private readonly productService: ProductService,
    private readonly productTypeService: ProductTypeService,
    private readonly clientService: ClientService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly dialogService: DialogService
  ) {}

  public productData: IProduct[] = [];
  public productTypeData: IProductType[] = [];
  public clientData: any[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();

  public ngOnInit(): void {
    this.productData = this.productService.findAll();
    this.productTypeData = this.productTypeService.findAll();
    this.clientData = [];
  }

  public createProduct() {
    this.ref = this.dialogService.open(ProductFormComponent, {
      header: 'Formulario de Registro',
      width: '50%',
      closable: true,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      maximizable: true,
    });
  }

  public updateProduct(product: IProduct) {
    this.ref = this.dialogService.open(ProductFormComponent, {
      header: 'Formulario de Actualización',
      width: '50%',
      closable: true,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      maximizable: true,
      data: product,
    });
  }

  public deleteProduct(productId: IProduct) {
    console.log(productId);
    this.confirmationService.confirm({
      message: 'Estas seguro de eliminar este registro?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Operación exitosa',
          detail: `El registro se elimino`,
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Operación cancelada',
          detail: 'El registro no se elimino',
        });
      },
    });
  }

  public cleanFilters(table: Table, filter: any) {
    table.clear();
    filter.value = '';
  }
}
