import { Component } from '@angular/core';
import { IProductType } from '../../api/interfaces/product-type.interface';
import { ProductTypeService } from '../../api/services/product-type.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
})
export class IndicatorComponent {
  public productTypes: IProductType[] = [];
  public indicatorForm: FormGroup = this.buildForm();

  public dateFrom: string = '';
  public dateUntil: string = '';
  public productType: IProductType = {} as IProductType;
  public showIndicator: boolean = false;
  isValid: boolean = false;

  data: any; //delete
  options: any; //delete
  constructor(
    private readonly productTypeService: ProductTypeService,
    private readonly formBuilder: FormBuilder
  ) {}

  public ngOnInit() {
    this.loadProductTypes();
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['TEST A', 'TEST B', 'TEST C'],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: [
            documentStyle.getPropertyValue('--cyan-700'),
            documentStyle.getPropertyValue('--cyan-500'),
            documentStyle.getPropertyValue('--cyan-200'),
          ],
        },
      ],
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
        title: {
          display: true,
          text: 'Custom Chart Test',
        },
      },
    };
  }

  private loadProductTypes(): void {
    this.productTypeService.findAll().subscribe({
      next: (productTypes: IProductType[]) => {
        this.productTypes = productTypes;
      },
    });
  }

  public generateIndicators(): void {
    this.dateFrom = this.indicatorForm.get('dateFrom')?.value;
    this.dateUntil = this.indicatorForm.get('dateUntil')?.value;
    this.productType =
      this.productTypes.find(
        (p) => p.id === this.indicatorForm.get('productType')?.value
      ) || ({} as IProductType);

    console.log(this.indicatorForm.getRawValue());
    this.showIndicator = true;
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
}
