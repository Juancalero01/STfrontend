import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ProductTypeFormComponent } from '../form/product-type-form.component';
import { ProductTypeService } from 'src/app/demo/api/services/product-type.service';
import { IProductType } from 'src/app/demo/api/interfaces/product-type.interface';

@Component({
  selector: 'app-product-type-table',
  templateUrl: './product-type-table.component.html',
})
export class ProductTypeTableComponent {
  constructor(
    private readonly productTypeService: ProductTypeService,
    private readonly dialogService: DialogService
  ) {}

  public productTypes: IProductType[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();

  ngOnInit(): void {
    this.loadProductTypes();
  }

  /**
   * Carga los tipos de producto desde el servicio de tipos de producto y los asigna a la propiedad 'productTypes' para su visualización en como filtro en la tabla
   */
  private loadProductTypes(): void {
    this.productTypeService.findAll().subscribe({
      next: (productTypes: IProductType[]) => {
        this.productTypes = productTypes;
      },
    });
  }

  /**
   * Abre un formulario para guardar o actualizar la información de un tipo de producto.
   * @param productData Datos del tipo de producto a editar. Si no se proporciona, se abre un formulario para registrar un nuevo tipo de producto.
   */
  public openProductTypeForm(productTypeData?: IProductType) {
    const header = productTypeData
      ? 'ACTUALIZAR TIPO DE PRODUCTO'
      : 'REGISTRAR TIPO DE PRODUCTO';

    this.ref = this.dialogService.open(ProductTypeFormComponent, {
      header: header,
      width: '50%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: productTypeData,
    });

    this.ref.onClose.subscribe(() => {
      this.loadProductTypes();
    });
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
