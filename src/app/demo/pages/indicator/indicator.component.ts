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
import {
  ClientData,
  FailureData,
  ProductTypeData,
} from '../../api/interfaces/indicator';

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
  public indicatorForm: FormGroup = this.buildIndicatorForm();

  public failureTypesData: any = [];
  public productTypesData: any;
  public clientsData: any;

  public showIndicator: boolean = false;
  public showButton: boolean = false;
  public showCleanFilters: boolean = false;
  public indicatorData: any = [];
  public options: any;
  public dialogRef: DynamicDialogRef = new DynamicDialogRef();

  public dateFrom: string = '';
  public dateUntil: string = '';
  public productType: string = '';
  public client: string = '';

  public ngOnInit() {
    this.getProductTypes();
    this.getClients();
    this.getConfigGlobalChart();
  }

  /**
   * Obtiene los tipos de producto desde el servicio correspondiente y las asigna al dropdown correspondiente.
   * Los tipos de producto se utilizan para llenar opciones en un dropdown de selección en el formulario de indicadores.
   */
  private getProductTypes(): void {
    this.productTypeService.findAll().subscribe({
      next: (productTypes: IProductType[]) => {
        this.productTypes = productTypes;
      },
    });
  }

  /**
   * Obtiene los clientes desde el servicio correspondiente y las asigna al dropdown correspondiente.
   * Los clientes se utilizan para llenar opciones en un dropdown de selección en el formulario de indicadores.
   */
  private getClients(): void {
    this.clientService.findAll().subscribe({
      next: (clients: IClient[]) => {
        this.clients = clients;
      },
    });
  }

  /**
   * Genera indicadores basados en los filtros seleccionados en el formulario.
   *
   * @remarks
   * Esta función envía una solicitud al servicio para obtener los indicadores correspondientes
   * según los filtros seleccionados en el formulario. Una vez que se reciben los datos, se actualizan
   * los indicadores en la interfaz, se generan gráficos y se actualizan los valores de los campos
   * de fecha, tipo de producto y cliente seleccionados. Además, se muestra un mensaje informativo si
   * no se encuentran resultados.
   */
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
          this.generateFailuresChart();
          this.generateProductsChart();
          this.generateClientsChart();
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
            summary: 'Info',
            detail: 'Sin resultados',
          });
        }
      },
    });
  }

  /**
   * Construye y devuelve un FormGroup para el formulario de busqueda de indicadores.
   * Este FormGroup contiene controles para capturar la información de la busqueda de indicadores,
   * aplicando validaciones a cada campo según los requisitos especificados.
   */
  private buildIndicatorForm(): FormGroup {
    return this.formBuilder.group({
      client: [null],
      productType: [null],
      dateFrom: [null, [Validators.required]],
      dateUntil: [null, [Validators.required]],
    });
  }

  /**
   * Verifica si el usuario ha realizado modificaciones en el formulario de busqueda de indicadores.
   * @returns true si el formulario ha sido modificado; de lo contrario, false.
   */
  public hasIndicatorFormChanged(): boolean {
    return !this.indicatorForm.pristine;
  }

  /**
   * Genera un gráfico de fallas basado en los datos proporcionados por el indicador de fallas.
   * Ordena los datos de fallas por porcentaje de mayor a menor y crea etiquetas y porcentajes
   * para su representación en el gráfico.
   */
  private generateFailuresChart() {
    const sortedData = this.indicatorData.failureServices.sort(
      (a: FailureData, b: FailureData) => b.percentage - a.percentage
    );

    const labels = sortedData.map(
      (item: FailureData) => `${item.failure} ${item.percentage}%`
    );

    const percentages = sortedData.map((item: FailureData) => item.percentage);

    this.failureTypesData = {
      labels: labels,
      datasets: [{ data: percentages }],
    };
  }

  /**
   * Genera un gráfico de tipos de producto basado en los datos proporcionados por el indicador de tipos de productos.
   * Ordena los datos de tipos de producto por porcentaje de mayor a menor y crea etiquetas y porcentajes
   * para su representación en el gráfico.
   */
  private generateProductsChart() {
    const sortedData = this.indicatorData.productTypeServices.sort(
      (a: ProductTypeData, b: ProductTypeData) => b.percentage - a.percentage
    );

    const labels = sortedData.map(
      (item: ProductTypeData) => `${item.productType} ${item.percentage}%`
    );
    const percentages = sortedData.map(
      (item: ProductTypeData) => item.percentage
    );

    this.productTypesData = {
      labels: labels,
      datasets: [{ data: percentages }],
    };
  }

  /**
   * Genera un gráfico de clientes basado en los datos proporcionados por el indicador de clientes.
   * Ordena los datos de clientes por porcentaje de mayor a menor y crea etiquetas y porcentajes
   * para su representación en el gráfico.
   */
  private generateClientsChart() {
    const sortedData = this.indicatorData.clientServices.sort(
      (a: ClientData, b: ClientData) => b.percentage - a.percentage
    );

    const labels = sortedData.map(
      (item: ClientData) => `${item.taxpayerName} ${item.percentage}%`
    );
    const percentages = sortedData.map((item: ClientData) => item.percentage);

    this.clientsData = {
      labels: labels,
      datasets: [{ data: percentages }],
    };
  }

  /**
   * Exporta el contenido de la página actual para excel en formato de tabla.
   */
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

  /**
   * Reinicia el formulario de indicadores y oculta los indicadores en la interfaz.
   */
  public clearFormAndHideIndicators() {
    this.indicatorForm.reset();
    this.showButton = false;
    this.showIndicator = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Filtros reseteados',
    });
    this.showCleanFilters = false;
  }

  /**
   * Abre un diálogo de indicadores con los datos de soporte proporcionados.
   * @param supports - Datos de soporte que se mostrarán en el formulario de indicadores.
   * @param header - Título del diálogo de indicadores.
   */
  public openIndicatorDialgog(supports: ISupport[], header: string): void {
    this.dialogRef = this.dialogService.open(IndicatorFormComponent, {
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

  /**
   * Exporta el contenido de la página actual para impresión.
   */
  public exportToPdf(): void {
    window.print();
  }

  /**
   * Obtiene la configuración global para el gráfico.
   */
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
}
