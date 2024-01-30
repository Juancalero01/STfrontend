import { Component } from '@angular/core';
import { IProductType } from '../../api/interfaces/product-type.interface';
import { ProductTypeService } from '../../api/services/product-type.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupportService } from '../../api/services/support.service';
import { MessageService } from 'primeng/api';
import { ExcelService } from 'src/app/shared/utils/services/excel.service';
import { IClient } from '../../api/interfaces/client.interface';
import { ClientService } from '../../api/services/client.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISupport } from '../../api/interfaces/support.interface';
import { IndicatorFormComponent } from './components/form/indicator-form.component';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
})
export class IndicatorComponent {
  constructor(
    private readonly productTypeService: ProductTypeService,
    private readonly clientService: ClientService,
    private readonly formBuilder: FormBuilder,
    private readonly supportService: SupportService,
    private readonly messageService: MessageService,
    private readonly excelService: ExcelService,
    private readonly dialogService: DialogService
  ) {}
  public productTypes: IProductType[] = [];
  public clients: IClient[] = [];
  public indicatorForm: FormGroup = this.buildForm();
  public dateFrom: string = '';
  public dateUntil: string = '';
  public productType: string = '';
  public client: string = '';
  public showIndicator: boolean = false;
  public showButton: boolean = false;
  public showCleanFilters: boolean = false;
  public indicatorData: any = [];
  public failureTypesData: any;
  public productTypesData: any;
  public clientsData: any;
  public options: any;
  public ref: DynamicDialogRef = new DynamicDialogRef();

  public ngOnInit() {
    this.loadProductTypes();
    this.loadClients();
    this.getConfigGlobalChart();
  }

  private loadProductTypes(): void {
    this.productTypeService.findAll().subscribe({
      next: (productTypes: IProductType[]) => {
        this.productTypes = productTypes;
      },
    });
  }

  private loadClients(): void {
    this.clientService.findAll().subscribe({
      next: (clients: IClient[]) => {
        this.clients = clients;
      },
    });
  }

  public generateIndicators(): void {
    const dataSend = {
      dateFrom: this.indicatorForm.get('dateFrom')?.value,
      dateUntil: this.indicatorForm.get('dateUntil')?.value,
      clientId: this.indicatorForm.get('client')?.value,
      productTypeId: this.indicatorForm.get('productType')?.value,
    };

    this.supportService.getServiceIndicators(dataSend).subscribe({
      next: (data: any) => {
        if (data !== null) {
          this.indicatorData = data;
          this.generateFailures();
          this.generateProducts();
          this.generateClients();
          this.dateFrom = this.indicatorForm.get('dateFrom')?.value;
          this.dateUntil = this.indicatorForm.get('dateUntil')?.value;
          const productTypeId = this.indicatorForm.get('productType')?.value;
          const clientId = this.indicatorForm.get('client')?.value;
          const selectedProductType = this.productTypes.find(
            (pt) => pt.id === productTypeId
          );
          const selectedClient = this.clients.find((c) => c.id === clientId);

          selectedProductType
            ? (this.productType = selectedProductType.name)
            : (this.productType = 'N/A');

          selectedClient
            ? (this.client = selectedClient.taxpayerName)
            : (this.client = 'N/A');

          this.showIndicator = true;
          this.showButton = true;
          this.showCleanFilters = true;
        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'Operación',
            detail: 'Sin resultados',
          });
        }
      },
    });
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      client: [null],
      productType: [null],
      dateFrom: [null, [Validators.required]],
      dateUntil: [null, [Validators.required]],
    });
  }

  public getChangesToUpdate(): boolean {
    return !this.indicatorForm.pristine;
  }

  private generateFailures() {
    const sortedData = this.indicatorData.failureServices.sort(
      (a: any, b: any) => b.percentage - a.percentage
    );

    const labels = sortedData.map(
      (item: any) => `${item.failure} ${item.percentage}%`
    );
    const percentages = sortedData.map((item: any) => item.percentage);

    this.failureTypesData = {
      labels: labels,
      datasets: [{ data: percentages }],
    };
  }

  private generateProducts() {
    const sortedData = this.indicatorData.productTypeServices.sort(
      (a: any, b: any) => b.percentage - a.percentage
    );

    const labels = sortedData.map(
      (item: any) => `${item.productType} ${item.percentage}%`
    );
    const percentages = sortedData.map((item: any) => item.percentage);

    this.productTypesData = {
      labels: labels,
      datasets: [{ data: percentages }],
    };
  }

  private generateClients() {
    const sortedData = this.indicatorData.clientServices.sort(
      (a: any, b: any) => b.percentage - a.percentage
    );

    const labels = sortedData.map(
      (item: any) => `${item.taxpayerName} ${item.percentage}%`
    );
    const percentages = sortedData.map((item: any) => item.percentage);

    this.clientsData = {
      labels: labels,
      datasets: [{ data: percentages }],
    };
  }

  private getConfigGlobalChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.options = {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: any) => context.parsed + '%',
          },
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            color: textColor,
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 6,
          },
          font: {
            size: 20,
          },
        },
        dataLabels: {
          display: true,
          align: 'center',
          font: {
            size: 20,
          },
        },
        label: {
          display: true,
        },
      },
    };
  }

  public exportToExcel(): void {
    const fileName = 'CNET_indicadores';
    this.excelService.export(
      {
        dateFrom: this.dateFrom,
        dateUntil: this.dateUntil,
        client: this.client,
        productType: this.productType,
        ...this.indicatorData,
      },
      fileName
    );
  }

  public cleanFormAndIndicators() {
    this.indicatorForm.reset();
    this.showButton = false;
    this.showIndicator = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Operación',
      detail: 'Filtros reseteados',
    });
    this.showCleanFilters = false;
  }

  public openIndicatorServiceForm(supports: ISupport[], header: string): void {
    this.ref = this.dialogService.open(IndicatorFormComponent, {
      header: header,
      width: '80%',
      closable: true,
      closeOnEscape: true,
      dismissableMask: false,
      showHeader: true,
      position: 'center',
      data: supports,
    });
  }

  public exportToPage(): void {
    window.print();
  }
}
