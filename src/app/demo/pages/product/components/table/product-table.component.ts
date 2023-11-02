import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
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
    private readonly messageService: MessageService,
    private readonly dialogService: DialogService
  ) {}

  public productData: IProduct[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();

  //clients
  // productTypes

  public clients: IClient[] = [];
  public productTypes: IProductType[] = [];

  //

  public ngOnInit(): void {
    this.getClients();
    this.getProductTypes();
    this.loadProducts();
  }

  public ngDestroy(): void {
    if (this.ref) this.ref.close();
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

  private loadProducts(): void {
    this.productService.findAll().subscribe({
      next: (products: IProduct[]) => {
        this.productData = products;
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
            detail: 'Error al cargar los productos',
          });
        }
      },
    });
  }

  // private loadProductTypes(): void {
  //   this.productTypeService.findAll().subscribe({
  //     next: (productTypes: IProductType[]) => {
  //       this.productTypeData = productTypes;
  //     },
  //     error: (e: any) => {
  //       if (e.status === 0) {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: 'Error de conexión con el servidor',
  //         });
  //       } else {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: 'Error al cargar los tipos de productos',
  //         });
  //       }
  //     },
  //   });
  // }

  // private loadClients(): void {
  //   this.clientService.findAll().subscribe({
  //     next: (clients: IClient[]) => {
  //       this.clientData = clients;
  //     },
  //     error: (e: any) => {
  //       if (e.status === 0) {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: 'Error de conexión con el servidor',
  //         });
  //       } else {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: 'Error al cargar los clientes',
  //         });
  //       }
  //     },
  //   });
  // }

  public createProduct() {
    this.ref = this.dialogService.open(ProductFormComponent, {
      header: 'FORMULARIO DE REGISTRO DE PRODUCTO',
      width: '50%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
    });

    this.ref.onClose.subscribe(() => {
      this.loadProducts();
    });
  }

  public updateProduct(product: IProduct) {
    this.ref = this.dialogService.open(ProductFormComponent, {
      header: 'FORMULARIO DE ACTUALIZACIÓN DE PRODUCTO',
      width: '50%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: product,
    });

    this.ref.onClose.subscribe(() => {
      this.loadProducts();
    });
  }

  public cleanFilters(table: Table, filter: any) {
    table.clear();
    filter.value = '';
  }
}
