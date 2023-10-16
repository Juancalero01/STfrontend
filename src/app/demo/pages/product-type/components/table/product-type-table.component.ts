import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
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
    private readonly messageService: MessageService,
    private readonly dialogService: DialogService
  ) {}

  public productTypeData: IProductType[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();

  public ngOnInit(): void {
    this.loadProductTypes();
  }

  public ngDestroy(): void {
    if (this.ref) this.ref.close();
  }

  private loadProductTypes(): void {
    this.productTypeService.findAll().subscribe({
      next: (productTypes: IProductType[]) => {
        this.productTypeData = productTypes;
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

  public createProductType() {
    this.ref = this.dialogService.open(ProductTypeFormComponent, {
      header: 'FORMULARIO DE REGISTRO DE TIPO DE PRODUCTO',
      width: '50%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
    });

    this.ref.onClose.subscribe(() => {
      this.loadProductTypes();
    });
  }

  public updateProductType(productType: IProductType) {
    this.ref = this.dialogService.open(ProductTypeFormComponent, {
      header: 'FORMULARIO DE ACTUALIZACIÓN DE TIPO DE PRODUCTO',
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
