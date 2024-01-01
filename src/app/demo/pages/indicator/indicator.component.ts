import { Component } from '@angular/core';
import { IProductType } from '../../api/interfaces/product-type.interface';
import { ProductTypeService } from '../../api/services/product-type.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupportService } from '../../api/services/support.service';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
})
export class IndicatorComponent {
  constructor(
    private readonly productTypeService: ProductTypeService,
    private readonly formBuilder: FormBuilder,
    private readonly supportService: SupportService
  ) {}
  public productTypes: IProductType[] = [];
  public indicatorForm: FormGroup = this.buildForm();
  public dateFrom: string = '';
  public dateUntil: string = '';
  public productType: IProductType = {} as IProductType;
  public showIndicator: boolean = false;
  public isValid: boolean = false;
  public indicatorData: any = [];

  public failureTypesData: any;
  public productTypesData: any;
  // public failureOptions: any;
  // public productOptions: any;
  public options: any;

  public ngOnInit() {
    this.loadProductTypes();
    this.getConfigGlobalChart();
  }

  private loadProductTypes(): void {
    this.productTypeService.findAll().subscribe({
      next: (productTypes: IProductType[]) => {
        this.productTypes = productTypes;
      },
    });
  }

  public generateIndicators(): void {
    const dataSend = {
      dateFrom: (this.dateFrom = this.indicatorForm.get('dateFrom')?.value),
      dateUntil: (this.dateUntil = this.indicatorForm.get('dateUntil')?.value),
      productTypeId: (this.productType =
        this.indicatorForm.get('productType')?.value),
    };
    this.supportService.getServiceIndicators(dataSend).subscribe({
      next: (data: any) => {
        this.indicatorData = data;
        this.generateFailures();
        this.generateProducts();
      },
      complete: () => {
        this.showIndicator = true;
      },
    });
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      productType: [null],
      dateFrom: [null, [Validators.required]],
      dateUntil: [null, [Validators.required]],
    });
  }

  public getChangesToUpdate(): boolean {
    return !this.indicatorForm.pristine;
  }

  private generateFailures() {
    const labels = this.indicatorData.failureServices.map(
      (item: any) => item.failure
    );
    const percentages = this.indicatorData.failureServices.map(
      (item: any) => item.percentage
    );

    this.failureTypesData = {
      labels: labels,
      datasets: [{ data: percentages }],
    };
  }

  private generateProducts() {
    const labels = this.indicatorData.productTypeServices.map(
      (item: any) => item.productType
    );
    const percentages = this.indicatorData.productTypeServices.map(
      (item: any) => item.percentage
    );

    this.productTypesData = {
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
