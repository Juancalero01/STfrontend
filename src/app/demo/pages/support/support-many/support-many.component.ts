import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IProduct } from 'src/app/demo/api/interfaces/product.interface';
import { ISupportPriority } from 'src/app/demo/api/interfaces/support-priority.interface';
import { ISupportState } from 'src/app/demo/api/interfaces/support-state.interface';
import {
  ISupport,
  ISupportMany,
} from 'src/app/demo/api/interfaces/support.interface';
import { ProductService } from 'src/app/demo/api/services/product.service';
import { SupportPriorityService } from 'src/app/demo/api/services/support-priority.service';
import { SupportStateService } from 'src/app/demo/api/services/support-state.service';
import { SupportService } from 'src/app/demo/api/services/support.service';

@Component({
  selector: 'app-support-many',
  templateUrl: './support-many.component.html',
})
export class SupportManyComponent {
  @ViewChild('search', { static: false }) search!: ElementRef;
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
  public supportManyForm: FormGroup = this.buildSupportManyForm();
  public supports: ISupportMany[] = [];
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

  /**
   * Construye y devuelve un FormGroup para el formulario de servicios masivos.
   * Este FormGroup contiene controles para capturar la información de los servicios masivos,
   * aplicando validaciones a cada campo según los requisitos especificados.
   */
  private buildSupportManyForm(): FormGroup {
    return this.formBuilder.group({
      search: [
        null,
        [Validators.required, Validators.pattern(/^\d{1,4}(-?\d{4,5})?$/)],
      ],
      dateEntry: [null, [Validators.required]],
      startReference: [null, [Validators.required]],
      securityStrap: [null, [Validators.required]],
      reclaim: [null],
      state: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      product: [null, [Validators.required]],
      warranty: [null, [Validators.required]],
    });
  }

  /**
   * Guarda los datos de un nuevo servicio.
   * Calcula el número de reclamo basado en la fecha de entrada y el último número de reclamo registrado.
   * Agrega el nuevo servicio al arreglo de servicios.
   * Reinicia los campos del formulario después de guardar los datos.
   * Deshabilita los campos si hay servicios guardados en la lista.
   * Pone el enfoque en el campo de búsqueda si está activo.
   */
  public saveData(): void {
    const support = this.getSupportData();
    if (this.supports.length > 0) {
      const lastReclaimNumber = this.getLastReclaimSupportItem();
      support.reclaim = `CNET-${support.dateEntry
        .toISOString()
        .split('T')[0]
        .replace(/-/g, '')}-${lastReclaimNumber + 1}`;
    }
    this.supports.push(support);
    //
    this.resetFieldsFormOnSave();
    if (this.supports.length > 0) {
      this.disableFields();
    }
    if (this.search) {
      this.search.nativeElement.focus();
    }
  }

  /**
   * Obtiene el número de reclamo del último servicio registrado.
   * Extrae el número de reclamo del formato "CNET-YYYYMMDD-N".
   * @returns El número de reclamo del último servicio como un número entero.
   */
  private getLastReclaimSupportItem(): number {
    const lastSupport = this.supports[this.supports.length - 1];
    const lastReclaimNumber = Number(lastSupport.reclaim.split('-').pop());
    return lastReclaimNumber;
  }

  /**
   * Realiza una búsqueda de productos utilizando el número de serie proporcionado.
   * Si se encuentra el producto, comprueba si hay soporte activo asociado a él o si ya ha sido agregado previamente.
   * Calcula la garantía del producto basándose en la fecha de entrega.
   * Actualiza el formulario de soporte múltiple con los datos del producto si es válido y no ha sido agregado previamente.
   * Si es el primer producto agregado, calcula el número de reclamo más reciente.
   */
  public searchProduct() {
    let serial = this.supportManyForm.get('search')?.value;
    if (serial && !serial.includes('-')) {
      if (serial.startsWith('0160') || serial.startsWith('0161')) {
        serial = serial.slice(0, 4) + '-' + serial.slice(4);
      }
    }

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
            this.calculateWarranty(product.deliveryDate);
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

  /**
   * Elimina un registro de soporte múltiple.
   * Muestra un cuadro de diálogo de confirmación antes de proceder con la eliminación.
   * Si se confirma la eliminación, elimina el registro del arreglo de soportes múltiples.
   * Ajusta los números de reclamo de los registros restantes si es necesario.
   * Muestra un mensaje de éxito después de eliminar el registro.
   * Habilita los campos si no hay registros restantes en la lista de soportes.
   * @param support El objeto de soporte a eliminar.
   */
  public deleteSupportItem(support: ISupportMany) {
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

  /**
   * Obtiene el último número de reclamo registrado y lo asigna al formulario por defecto.
   * Si es el primer elemento en el que se asigna, se utiliza el número 1.
   * Utiliza la fecha actual para generar el número de reclamo en el formato esperado.
   */
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

  /**
   * Carga los estados de soporte disponibles en el formulario.
   * Obtiene todos los estados de soporte desde el servicio correspondiente.
   * Asigna el primer estado encontrado al formulario de soporte múltiple.
   */
  private loadStates(): void {
    this.supportStateService.findAll().subscribe({
      next: (states: ISupportState[]) => {
        this.supportManyForm.patchValue({
          state: states[0],
        });
      },
    });
  }

  /**
   * Carga las prioridades de soporte disponibles en el componente.
   * Obtiene todas las prioridades de soporte desde el servicio correspondiente.
   * Asigna las prioridades obtenidas a la variable 'priorities' del componente.
   */
  private loadPriorities(): void {
    this.supportPriorityService.findAll().subscribe({
      next: (priorities: ISupportPriority[]) => {
        this.priorities = priorities;
      },
    });
  }

  /**
   * Restablece los campos del formulario de soporte múltiple antes de guardar.
   * Restaura los valores de los campos a sus estados iniciales.
   */
  private resetFieldsFormOnSave(): void {
    this.supportManyForm.reset({
      dateEntry: this.supportManyForm.get('dateEntry')?.value,
      state: this.supportManyForm.get('state')?.value,
      priority: this.supportManyForm.get('priority')?.value,
      startReference: this.supportManyForm.get('startReference')?.value,
      securityStrap: this.supportManyForm.get('securityStrap')?.value,
    });
  }

  /**
   * Restablece los campos básicos del formulario de soporte múltiple.
   * Vuelve a los valores iniciales de los campos básicos del formulario.
   */
  private resetFieldsForm(): void {
    this.supportManyForm.reset({
      dateEntry: this.supportManyForm.get('dateEntry')?.value,
      state: this.supportManyForm.get('state')?.value,
    });
  }

  /**
   * Obtiene la información necesaria del formulario para enviarla mediante un endpoint.
   * Extrae los datos relevantes del formulario y los devuelve como un objeto de tipo ISupportMany.
   */
  private getSupportData(): ISupportMany {
    const { search, ...support } = this.supportManyForm.getRawValue();
    return support;
  }

  /**
   * Deshabilita los campos específicos del formulario de soporte múltiple.
   */
  private disableFields() {
    this.supportManyForm.get('dateEntry')?.disable();
    this.supportManyForm.get('priority')?.disable();
    this.supportManyForm.get('startReference')?.disable();
  }

  /**
   * Habilita los campos específicos del formulario de soporte múltiple.
   */
  private enableFields() {
    this.supportManyForm.get('dateEntry')?.enable();
    this.supportManyForm.get('priority')?.enable();
    this.supportManyForm.get('startReference')?.enable();
  }

  /**
   * Función que maneja la pulsación de tecla "Enter" en el lector de códigos de barras de los productos.
   * Genera automáticamente una pulsación de tecla "Enter" y envía la petición de búsqueda del producto.
   */
  public onKeyPressEnter(event: Event) {
    const allowedCharacters = /^\d{1,4}(-?\d{4,5})?$/;
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

  /**
   * Limpia el valor del campo de entrada de texto del número de serie.
   */
  public clearValue() {
    const inputElement = this.search.nativeElement as HTMLInputElement;
    if (inputElement.value) {
      inputElement.value = '';
      return;
    }
  }

  /**
   * Guarda la información cargada en todos los servicios (nuevos).
   * Muestra un mensaje de confirmación antes de crear los registros.
   * Si se confirma, envía la solicitud de creación de los registros al servicio correspondiente.
   * Maneja los posibles errores y realiza acciones después de completar la operación.
   */
  public createSupports(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea crear los registros?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      rejectLabel: 'CANCELAR',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-sm p-button-info',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
      accept: () =>
        this.supportService.createMany(this.supports).subscribe({
          next: () =>
            this.messageService.add({
              severity: 'success',
              summary: 'Operación exitosa',
              detail: 'El registro se creó correctamente',
            }),
          error: (err: HttpErrorResponse) =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error al crear los registros',
            }),
          complete: () => {
            this.clearSupports();
            this.resetFieldsForm();
            this.enableFields();
          },
        }),
    });
  }

  /**
   * Elimina todos los soportes que se han creado.
   */
  public clearSupports(): void {
    this.supports = [];
  }

  /**
   * Calcula si el producto está dentro del período de garantía.
   * Actualiza el valor del campo "warranty" en el formulario de soporte múltiple.
   * @param deliveryDate La fecha de entrega del producto.
   */
  private calculateWarranty(deliveryDate: Date): void {
    const oneYearLater = new Date(deliveryDate);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    const sixMonthsLater = new Date(oneYearLater);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    let warranty: boolean;

    if (this.today <= oneYearLater) {
      warranty = true;
    } else if (this.today <= sixMonthsLater) {
      warranty = true;
    } else {
      warranty = false;
    }
    this.supportManyForm.patchValue({
      warranty: warranty,
    });
  }
}
