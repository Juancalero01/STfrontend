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
  isValid: boolean = false;

  public indicatorData: any = [];

  public data: any;
  public options: any;

  public ngOnInit() {
    this.loadProductTypes();
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
        this.generateTest();
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

  // private generateTest() {
  //   const documentStyle = getComputedStyle(document.documentElement);
  //   const textColor = documentStyle.getPropertyValue('--text-color');

  //   const labels = this.indicatorData.failureServices.map(
  //     (item: any) => item.failure
  //   );
  //   const percentages = this.indicatorData.failureServices.map(
  //     (item: any) => item.percentage
  //   );

  //   this.data = {
  //     labels: labels,
  //     datasets: [
  //       {
  //         data: percentages,
  //         text: percentages.map((percentage: any) => `${percentage}%`),
  //       },
  //     ],
  //   };

  //   this.options = {
  //     plugins: {
  //       legend: {
  //         labels: {
  //           usePointStyle: true,
  //           color: textColor,
  //         },
  //       },
  //       title: {
  //         display: true,
  //         text: 'Tasa e indice de tipo de fallas',
  //       },
  //     },
  //   };
  // }

  private generateTest() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    const labels = this.indicatorData.failureServices.map(
      (item: any) => item.failure
    );
    const percentages = this.indicatorData.failureServices.map(
      (item: any) => item.percentage
    );

    this.data = {
      labels: labels,
      datasets: [
        {
          data: percentages,
        },
      ],
    };

    this.options = {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context: any) {
              let label = context.label || '';

              if (label) {
                label += ': ';
              }
              if (context.parsed !== null) {
                label += context.parsed + '%';
              }
              return label;
            },
          },
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            color: textColor,
          },
        },
        title: {
          display: true,
          text: 'Tasa e índice de tipo de fallas',
        },
      },
    };
  }
}
