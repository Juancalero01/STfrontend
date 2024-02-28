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
  public supports: {
    reclaim: string;
    product: IProduct;
    dateEntry: Date;
    startReference: string;
    securityStrap: boolean;
    priority: ISupportPriority;
    state: ISupportState;
  }[] = [];
  public today: Date = new Date();
  public minDate: Date = new Date(
    new Date().setMonth(new Date().getMonth() - 1)
  );
  public maxDate: Date = this.today;

  ngOnInit(): void {
    this.loadStates();
    this.loadPriorities();
    this.supportManyForm.get('dateEntry')?.setValue(this.today);
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      search: [
        null,
        [Validators.required, Validators.pattern(/^\d{1,4}(-\d{4,5})?$/)],
      ],
      dateEntry: [null, [Validators.required]],
      startReference: [null, [Validators.required]],
      securityStrap: [null, [Validators.required]],
      reclaim: [null],
      state: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      product: [null, [Validators.required]],
    });
  }

  //TODO: Antes de subirlo se requiere cambiar el nombre de la función ya que no expecifica realmente para que sirve, No es un chequeo de data es para guardar la data en el array.
  public checkData(): void {
    const support = this.getSupportData();
    if (this.supports.length > 0) {
      const lastReclaimNumber = this.getLastReclaimSupport();
      support.reclaim = `CNET-${support.dateEntry
        .toISOString()
        .split('T')[0]
        .replace(/-/g, '')}-${lastReclaimNumber + 1}`;
    }
    this.supports.push(support);
    this.resetFields();
    if (this.supports.length > 0) {
      this.disableFields();
    }
  }

  private getLastReclaimSupport(): number {
    const lastSupport = this.supports[this.supports.length - 1];
    const lastReclaimNumber = Number(lastSupport.reclaim.split('-').pop());
    return lastReclaimNumber;
  }

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
            const productExists = this.supports.some(
              (support) => support.product.id === product.id
            );
            if (productExists) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Info',
                detail: 'El producto ya ha sido agregado',
              });
              return;
            }
            this.supportManyForm.patchValue({
              product: product,
            });
            if (this.supports.length === 0) {
              this.getLastReclaimNumber();
            }
          },
        });
      },
    });
  }

  //Elimina el elemento, hay que ver si realmente es necesario.
  public deleteItem(support: {
    dateEntry: Date;
    startReference: string;
    securityStrap: boolean;
    reclaim: string;
    state: ISupportState;
    priority: ISupportPriority;
    product: IProduct;
  }) {
    const index = this.supports.indexOf(support);
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el registro?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      rejectLabel: 'CANCELAR',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-sm p-button-info',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
      accept: () => {
        if (index !== -1) {
          this.supports.splice(index, 1);
          for (let i = index; i < this.supports.length; i++) {
            const currentItem = this.supports[i];
            const parts = currentItem.reclaim.split('-');
            const lastPart = parts.pop();
            if (lastPart) {
              const newLastPart = parseInt(lastPart) - 1;
              parts.push(newLastPart.toString());
              currentItem.reclaim = parts.join('-');
            }
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'El registro se eliminó correctamente',
          });
          if (this.supports.length === 0) {
            this.enableFields();
          }
        }
      },
    });
  }

  //Obtiene el ultimo numero de reclamo y lo asigna al formulario por defecto, seria el primer elemento en el que se asigna
  private getLastReclaimNumber(): void {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    this.supportService.findLastReclaim().subscribe({
      next: (reclaimFound: string | null) => {
        const lastReclaimNumber = reclaimFound
          ? Number(reclaimFound.split('-').pop()) + 1
          : 1;
        this.supportManyForm
          .get('reclaim')
          ?.setValue(`CNET-${today}-${lastReclaimNumber}`);
      },
    });
  }

  //Carga los estados y establece por defecto el primer elemento del array
  private loadStates(): void {
    this.supportStateService.findAll().subscribe({
      next: (states: ISupportState[]) => {
        this.supportManyForm.patchValue({
          state: states[0],
        });
      },
    });
  }
  //Carga las prioridades para el dropdown
  private loadPriorities(): void {
    this.supportPriorityService.findAll().subscribe({
      next: (priorities: ISupportPriority[]) => {
        this.priorities = priorities;
      },
    });
  }
  private resetFields(): void {
    this.supportManyForm.reset({
      dateEntry: this.supportManyForm.get('dateEntry')?.value,
      state: this.supportManyForm.get('state')?.value,
      priority: this.supportManyForm.get('priority')?.value,
      startReference: this.supportManyForm.get('startReference')?.value,
      securityStrap: this.supportManyForm.get('securityStrap')?.value,
    });
  }

  private getSupportData(): {
    reclaim: string;
    product: IProduct;
    dateEntry: Date;
    startReference: string;
    securityStrap: boolean;
    priority: ISupportPriority;
    state: ISupportState;
  } {
    const { search, ...support } = this.supportManyForm.getRawValue();
    return support;
  }

  private disableFields() {
    this.supportManyForm.get('dateEntry')?.disable();
    this.supportManyForm.get('priority')?.disable();
    this.supportManyForm.get('startReference')?.disable();
  }

  private enableFields() {
    this.supportManyForm.get('dateEntry')?.enable();
    this.supportManyForm.get('priority')?.enable();
    this.supportManyForm.get('startReference')?.enable();
  }

  onKeyPress(event: Event) {
    const allowedCharacters = /^\d{0,4}(-\d{0,5})?$/;
    const inputValue = (event.target as HTMLInputElement).value;
    if (allowedCharacters.test(inputValue)) {
      this.searchProduct();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Info',
        detail: 'Número de serie invalido',
      });
    }
  }
}
