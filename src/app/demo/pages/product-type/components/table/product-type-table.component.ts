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

  public ngOnInit(): void {
    this.loadProductTypes();
  }

  private loadProductTypes(): void {
    this.productTypeService.findAll().subscribe({
      next: (productTypes: IProductType[]) => {
        this.productTypes = productTypes;
      },
    });
  }

  public openProductTypeForm(productType?: IProductType) {
    const header = productType
      ? 'FORMULARIO DE ACTUALIZACIÓN DE TIPO DE PRODUCTO'
      : 'FORMULARIO DE REGISTRO DE TIPO DE PRODUCTO';

    this.ref = this.dialogService.open(ProductTypeFormComponent, {
      header: header,
      width: '50%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: productType,
    });

    this.ref.onClose.subscribe(() => {
      this.loadProductTypes();
    });
  }

  public cleanFilters(table: Table, filter: any) {
    table.clear();
    filter.value = '';
  }
}
