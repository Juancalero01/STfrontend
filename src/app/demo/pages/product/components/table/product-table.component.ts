import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { IProductType } from 'src/app/demo/api/interfaces/product-type.interface';
import { IProduct } from 'src/app/demo/api/interfaces/product.interface';
import { IClient } from 'src/app/demo/api/interfaces/client.interface';
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
    private readonly dialogService: DialogService
  ) {}

  public products: IProduct[] = [];
  public clients: IClient[] = [];
  public productTypes: IProductType[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();

  public ngOnInit(): void {
    this.getClients();
    this.getProductTypes();
    this.getProducts();
  }

  public ngDestroy(): void {
    this.ref ? this.ref.close() : null;
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

  private getProducts(): void {
    this.productService.findAll().subscribe({
      next: (products: IProduct[]) => (this.products = products),
    });
  }

  public openProductForm(product?: IProduct) {
    const header = product
      ? 'FORMULARIO DE ACTUALIZACIÓN DE PRODUCTO'
      : 'FORMULARIO DE REGISTRO DE PRODUCTO';

    this.ref = this.dialogService.open(ProductFormComponent, {
      header: header,
      width: '60%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: product,
    });

    this.ref.onClose.subscribe(() => this.getProducts());
  }

  public cleanFilters(table: Table, filter: any) {
    table.clear();
    filter.value = '';
  }
}
