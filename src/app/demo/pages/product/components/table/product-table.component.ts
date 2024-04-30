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

  ngOnInit(): void {
    this.loadClients();
    this.loadProductTypes();
    this.loadProducts();
  }

  /**
   * Carga los clientes desde el servicio de clientes y los asigna a la propiedad 'clients' para su visualización en como filtro en la tabla
   */
  private loadClients(): void {
    this.clientService.findAll().subscribe({
      next: (clients: IClient[]) => (this.clients = clients),
    });
  }

  /**
   * Carga los tipos de producto desde el servicio de tipos de producto y los asigna a la propiedad 'productTypes' para su visualización en como filtro en la tabla
   */
  private loadProductTypes(): void {
    this.productTypeService.findAll().subscribe({
      next: (productTypes: IProductType[]) =>
        (this.productTypes = productTypes),
    });
  }

  /**
   * Carga los productos desde el servicio de productos y los asigna a la propiedad 'products' para su visualización en la tabla.
   */
  private loadProducts(): void {
    this.productService.findAll().subscribe({
      next: (products: IProduct[]) => (this.products = products),
    });
  }

  /**
   * Abre un formulario para guardar o actualizar la información de un producto.
   * @param productData Datos del producto a editar. Si no se proporciona, se abre un formulario para registrar un nuevo producto.
   */
  public openProductForm(productId?: number) {
    const header = productId ? 'Editar producto' : 'Registrar producto';

    this.ref = this.dialogService.open(ProductFormComponent, {
      header: header,
      width: '50%',
      contentStyle: { 'min-height': '80%' },
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: productId,
    });
    this.ref.onClose.subscribe(() => this.loadProducts());
  }

  /**
   * Elimina los filtros de búsqueda o paginación en una tabla.
   * @param table La tabla (Table) de PrimeNG de la que se eliminarán los filtros.
   * @param filter El filtro de búsqueda o paginación que se reiniciará.
   */
  public cleanFilters(table: Table, filter: any) {
    table.clear();
    filter.value = '';
  }
}
