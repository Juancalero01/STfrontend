import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IClient } from 'src/app/demo/api/interfaces/client.interface';
import { IProvince } from 'src/app/demo/api/interfaces/province.interface';
import { ITaxCondition } from 'src/app/demo/api/interfaces/tax-condition.interface';
import { TaxConditionService } from 'src/app/demo/api/services/tax-condition.service';
import { ProvinceService } from 'src/app/demo/api/services/province.service';
import { ClientService } from 'src/app/demo/api/services/client.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
})
export class ClientFormComponent {
  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly formBuilder: FormBuilder,
    private readonly provinceService: ProvinceService,
    private readonly taxConditionService: TaxConditionService,
    private readonly clientService: ClientService
  ) {}

  public clientForm: FormGroup = this.buildClientForm();
  public provinces: IProvince[] = [];
  public taxConditions: ITaxCondition[] = [];
  public buttonLabel: string = 'REGISTRAR FORMULARIO';

  ngOnInit(): void {
    this.getProvinces();
    this.getTaxConditions();
    if (this.config.data) {
      this.loadClientDataIntoForm(this.config.data);
      this.buttonLabel = 'ACTUALIZAR FORMULARIO';
    }
  }

  /**
   * Construye y devuelve un FormGroup para el formulario de clientes.
   * Este FormGroup contiene controles para capturar la información del cliente,
   * aplicando validaciones a cada campo según los requisitos especificados.
   */
  private buildClientForm(): FormGroup {
    return this.formBuilder.group({
      taxpayerName: [
        null,
        [
          Validators.required,
          Validators.maxLength(150),
          Validators.pattern(/^[a-zA-Z0-9\s.]+$/),
        ],
      ],
      taxpayerId: [
        null,
        [Validators.minLength(13), Validators.pattern(/^\d{2}-\d{8}-\d{1}$/)],
      ],
      taxpayerEmail: [null, [Validators.email, Validators.maxLength(120)]],
      taxpayerPhone: [
        null,
        [Validators.maxLength(20), Validators.pattern(/^[0-9()+-\s]+$/)],
      ],
      street: [
        null,
        [Validators.maxLength(150), Validators.pattern(/^[a-zA-Z0-9\s.,#-]+$/)],
      ],
      number: [
        null,
        [Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)],
      ],
      floor: [
        null,
        [Validators.maxLength(10), Validators.pattern(/^[a-zA-Z0-9]+$/)],
      ],
      office: [
        null,
        [Validators.maxLength(10), Validators.pattern(/^[\w\s-,]+$/)],
      ],
      postalCode: [
        null,
        [Validators.maxLength(8), Validators.pattern(/^[a-zA-Z0-9]+$/)],
      ],
      contactName: [
        null,
        [Validators.maxLength(120), Validators.pattern(/^[a-zA-Z\s]+$/)],
      ],
      contactEmail: [null, [Validators.email, Validators.maxLength(120)]],
      contactPhone: [
        null,
        [Validators.maxLength(20), Validators.pattern(/^[0-9()+-\s]+$/)],
      ],
      comment: [null, [Validators.maxLength(250)]],
      taxCondition: [null],
      province: [null],
    });
  }

  /**
   * Carga los datos del cliente en el formulario correspondiente.
   * Utiliza los datos del cliente proporcionados para completar los campos del formulario,
   * asignando los valores de los campos a partir de la información del cliente.
   */
  private loadClientDataIntoForm(clientData: IClient): void {
    this.clientForm.patchValue({
      ...clientData,
      taxCondition: clientData.taxCondition?.id,
      province: clientData.province?.id,
    });
  }

  /**
   * Obtiene las provincias desde el servicio correspondiente y las asigna al dropdown correspondiente.
   * Las provincias se utilizan para llenar opciones en un dropdown de selección en el formulario del cliente.
   */
  private getProvinces(): void {
    this.provinceService.findAll().subscribe({
      next: (provinces: IProvince[]) => (this.provinces = provinces),
    });
  }

  /**
   * Obtiene las condiciones fiscales del cliente desde el servicio correspondiente y las asigna al dropdown correspondiente.
   * Las condiciones fiscales se utilizan para llenar opciones en un dropdown de selección en el formulario del cliente.
   */
  private getTaxConditions(): void {
    this.taxConditionService.findAll().subscribe({
      next: (taxConditions: ITaxCondition[]) =>
        (this.taxConditions = taxConditions),
    });
  }

  /**
   * Valida un control específico del formulario del cliente.
   * Comprueba si el control especificado es inválido y ha sido tocado.
   * @param controlName El nombre del control que se va a validar.
   * @returns Verdadero si el control es inválido y ha sido tocado, de lo contrario, indefinido.
   */
  public isFormControlInvalid(controlName: string): boolean | undefined {
    return (
      this.clientForm.get(controlName)?.invalid &&
      this.clientForm.get(controlName)?.touched
    );
  }

  /**
   * Envía el formulario del cliente para crear un nuevo registro o actualizar uno existente.
   * Determina si se debe llamar a la función de confirmación de creación o actualización del cliente.
   */
  public processClientForm(): void {
    if (!this.config.data) {
      this.confirmCreateClient();
    } else {
      this.confirmUpdateClient();
    }
  }

  /**
   * Cierra el formulario de clientes.
   * Muestra un diálogo de confirmación antes de cerrar.
   */
  public closeClientForm(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cancelar la operación?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      rejectLabel: 'CANCELAR',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-sm p-button-info',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
      accept: () => this.ref.close(),
    });
  }

  /**
   * Crea un nuevo registro de cliente.
   * Muestra un diálogo de confirmación antes de realizar la operación.
   */
  public confirmCreateClient(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea crear el registro?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      rejectLabel: 'CANCELAR',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-sm p-button-info',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
      accept: () => {
        this.clientService.create(this.clientForm.value).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Operación exitosa',
              detail: 'Registro creado correctamente',
            });
            this.ref.close();
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 409) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El cliente ya existe',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al crear el cliente',
              });
            }
          },
        });
      },
    });
  }

  /**
   * Actualiza el registro de cliente.
   * Muestra un diálogo de confirmación antes de realizar la operación.
   */
  public confirmUpdateClient(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea actualizar el registro?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      rejectLabel: 'CANCELAR',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-sm p-button-info',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
      accept: () => {
        this.clientService
          .update(this.config.data.id, this.clientForm.value)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'Registro actualizado correctamente',
              });

              this.ref.close();
            },
            error: (err: HttpErrorResponse) => {
              if (err.status === 404) {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Cliente no encontrado',
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Ocurrió un error al actualizar el cliente',
                });
              }
            },
          });
      },
    });
  }

  /**
   * Verifica si el usuario ha realizado modificaciones en el formulario de clientes.
   * @returns true si el formulario ha sido modificado; de lo contrario, false.
   */
  public hasClientFormChanged(): boolean {
    return !this.clientForm.pristine;
  }
}
