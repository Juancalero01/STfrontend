import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IProduct } from 'src/app/demo/api/interfaces/product.interface';
import { ISupportPriority } from 'src/app/demo/api/interfaces/support-priority.interface';
import { ISupportState } from 'src/app/demo/api/interfaces/support-state.interface';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { ProductService } from 'src/app/demo/api/services/product.service';
import { SupportPriorityService } from 'src/app/demo/api/services/support-priority.service';
import { SupportStateService } from 'src/app/demo/api/services/support-state.service';
import { SupportService } from 'src/app/demo/api/services/support.service';

@Component({
  selector: 'app-support-many',
  templateUrl: './support-many.component.html',
})
export class SupportManyComponent {
  /**
   *
   */
  constructor(
    private readonly supportStateService: SupportStateService,
    private readonly supportPriorityService: SupportPriorityService,
    private readonly formBuilder: FormBuilder,
    private readonly productService: ProductService,
    private readonly supportService: SupportService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService
  ) {}

  public states: ISupportState[] = [];
  public priorities: ISupportPriority[] = [];
  public booleanDropdown: any[] = [
    { value: true, label: 'SI' },
    { value: false, label: 'NO' },
  ];
  public supportManyForm: FormGroup = this.buildForm();

  ngOnInit(): void {
    this.loadStates();
    this.loadPriorities();
  }

  //todo: Verificar cuales son los elementos requeridos para hacer el servicio masivo.
  //todo: Tratar de identificar o hacer por defectos algunos campos.

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      search: [
        null,
        [Validators.required, Validators.pattern(/^\d{1,4}(-\d{4,5})?$/)],
      ],
      dateEntry: [null, [Validators.required]],
      startReference: [null, [Validators.maxLength(255)]],
      securityStrap: [null, [Validators.required]],
      state: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      product: [null, [Validators.required]],
    });
  }

  private loadStates(): void {
    this.supportStateService.findAll().subscribe({
      next: (states: ISupportState[]) => {
        this.states = states.filter((s) => s.id === 1);
      },
    });
  }

  private loadPriorities(): void {
    this.supportPriorityService.findAll().subscribe({
      next: (priorities: ISupportPriority[]) => {
        this.priorities = priorities;
      },
    });
  }

  public checkData(): void {
    console.log(this.supportManyForm.value);
  }

  //TODO: Copy function (Support Form)
  public searchProduct() {
    const serial = this.supportManyForm.get('search')?.value;
    this.productService.findOneSerial(serial).subscribe({
      next: (product: IProduct) => {
        if (!product) {
          this.messageService.add({
            severity: 'info',
            summary: `Info`,
            detail: 'Producto no encontrado',
          });
          return;
        }
        this.supportService.findAllByProduct(product.id).subscribe({
          next: (supports: ISupport[]) => {
            const supportActive = supports.find(
              (support) => support.state.id !== 12 && support.state.id !== 13
            );
            if (supportActive) {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Producto con soporte activo',
              });
              return;
            }
            this.supportManyForm.patchValue({
              product: product.id,
            });
          },
        });
      },
    });
  }
}
