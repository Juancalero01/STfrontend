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
    dateEntry: Date;
    startReference: string;
    securityStrap: boolean;
    reclaim: string;
    state: ISupportState;
    priority: ISupportPriority;
    product: IProduct;
  }[] = [];
  private lastReclaimNumber: string = '';

  ngOnInit(): void {
    this.loadStates();
    this.loadPriorities();
    this.disableFields();
    this.getLastReclaimNumber();
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      search: [
        null,
        [Validators.required, Validators.pattern(/^\d{1,4}(-\d{4,5})?$/)],
      ],
      dateEntry: [null, [Validators.required]],
      startReference: [null, [Validators.maxLength(255)]],
      securityStrap: [null, [Validators.required]],
      reclaim: [null, [Validators.required]],
      state: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      product: [null, [Validators.required]],
    });
  }

  private loadStates(): void {
    this.supportStateService.findAll().subscribe({
      next: (states: ISupportState[]) => {
        this.supportManyForm.patchValue({
          state: states[0],
        });
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
    const { search, ...data } = this.supportManyForm.value;
    this.supports.push(data);

    console.log(this.supports);
    this.supportManyForm.reset({
      dateEntry: this.supportManyForm.get('dateEntry')?.value,
      state: this.supportManyForm.get('state')?.value,
      priority: this.supportManyForm.get('priority')?.value,
      startReference: this.supportManyForm.get('startReference')?.value,
    });
    this.someFields();
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
              this.enableFields();
            }
          },
        });
      },
    });
  }

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
          this.messageService.add({
            severity: 'success',
            summary: 'Operación exitosa',
            detail: 'El registro se elimino correctamente',
          });
        }
      },
    });
  }

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

        this.lastReclaimNumber = `CNET-${today}-${lastReclaimNumber}`;
      },
    });
  }

  private enableFields() {
    this.supportManyForm.get('dateEntry')?.enable();
    this.supportManyForm.get('priority')?.enable();
    this.supportManyForm.get('startReference')?.enable();
    this.supportManyForm.get('securityStrap')?.enable();
  }

  private disableFields() {
    this.supportManyForm.get('search')?.enable();
    this.supportManyForm.get('dateEntry')?.disable();
    this.supportManyForm.get('priority')?.disable();
    this.supportManyForm.get('startReference')?.disable();
    this.supportManyForm.get('securityStrap')?.disable();
  }

  private someFields() {
    this.supportManyForm.get('dateEntry')?.clearValidators();
    this.supportManyForm.get('dateEntry')?.updateValueAndValidity();
    this.supportManyForm.get('startReference')?.clearValidators();
    this.supportManyForm.get('startReference')?.updateValueAndValidity();

    this.supportManyForm.get('dateEntry')?.disable();
    this.supportManyForm.get('startReference')?.disable();
    this.supportManyForm.get('search')?.enable();
    this.supportManyForm.get('priority')?.enable();
    this.supportManyForm.get('securityStrap')?.enable();
  }
}

//TODO: REAJUSTE DE PATANTALLA COMO MOSTRAR LOS DATOS POSIBLEMENTE SE MUESTRE CONE ESTADO Y PRIORIDAD AMBOS, VERIFICAR SI AGREGAR O NO EL BOTON DE ELIMINAR EL REGISTRO POR SI SE EQUIVOCA.
//TODO: REAJUSTAR EL CICLO DEL FORMULARIO EN EL PRIMER PASO SE DEBERIA HACER UNAS FUNCIONALIDADES Y EN OTROS PASOS NO, TAMBIEN TRATAR DE VER SI CUANDO SE ELIMINA QUE PASA CON EL NÚMERO DE RECLAMO
//TODO: POSIBLEMENTE SE REGENERE TODO EL RECLAMO A UNA ETAPA PRINCIPAL SIEMPRE ASI LLEVANDO UN ORDEN O DEJARLO COMO ESTA, AUTOINCREMENTABLE Y SI SE ELIMINA ESE NÚMERO DE RECLAMO YA NO EXISTIRA.
//TODO: LA POSIBLE SOLUCIÓN ES QUE SE REGENERE TODO DESDE EL ULTIMO Y AÑADIRLE +1 A CADA UNO Y ASI HASTA QUE NO HAYA SERVICIOS PARA GUARDAR
//TODO: IMPLEMENTAR EL BOTON PARA GUARDAR DIRECTAMENTE A LA APP EN UN ARRAY, VERIFICAR SI LA API LE LLEGA LOS OBJETOS QUE SE ENVIAN POR AQUI, PROBAR CON MAS DE 5 SERVICIOS.
