import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
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
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly dialogService: DialogService
  ) {}

  public productTypeData: IProductType[] = [];
  public ref: DynamicDialogRef = new DynamicDialogRef();

  public ngOnInit(): void {
    this.productTypeData = this.productTypeService.findAll();
  }

  public ngDestroy(): void {
    if (this.ref) this.ref.close();
  }

  public createProductType() {
    this.ref = this.dialogService.open(ProductTypeFormComponent, {
      header: 'Formulario de registro',
      width: '50%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
    });
  }

  public updateProductType(productType: IProductType) {
    this.ref = this.dialogService.open(ProductTypeFormComponent, {
      header: 'Formulario de actualización',
      width: '50%',
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: productType,
    });
  }

  public deleteProductType(productTypeId: IProductType) {
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
          severity: 'info',
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
