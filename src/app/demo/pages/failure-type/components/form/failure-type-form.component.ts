import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IFailureType } from 'src/app/demo/api/interfaces/failure-type.interface';
import { FailureTypeService } from 'src/app/demo/api/services/failure-type.service';

@Component({
  selector: 'app-failure-type-form',
  templateUrl: './failure-type-form.component.html',
})
export class FailureTypeFormComponent {
  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly formBuilder: FormBuilder,
    private readonly failureTypeService: FailureTypeService
  ) {}

  public failureTypeForm: FormGroup = this.buildFailureTypeForm();
  public buttonLabel: string = 'REGISTRAR FORMULARIO';

  ngOnInit(): void {
    if (this.config.data) {
      this.loadFailureTypeDataIntoForm(this.config.data);
      this.buttonLabel = 'ACTUALIZAR FORMULARIO';
    }
  }

  /**
   * Construye y devuelve un FormGroup para el formulario de tipos de falla.
   * Este FormGroup contiene controles para capturar la información del tipos de falla,
   * aplicando validaciones a cada campo según los requisitos especificados.
   */
  private buildFailureTypeForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(60)]],
      description: [null, [Validators.maxLength(250)]],
    });
  }

  /**
   * Carga los datos del tipos de fallas en el formulario correspondiente.
   * Utiliza los datos del tipos de fallas proporcionados para completar los campos del formulario,
   * asignando los valores de los campos a partir de la información del tipos de fallas.
   */
  private loadFailureTypeDataIntoForm(failureType: IFailureType): void {
    this.failureTypeForm.patchValue(failureType);
  }

  /**
   * Valida un control específico del formulario del tipos de fallas.
   * Comprueba si el control especificado es inválido y ha sido tocado.
   * @param controlName El nombre del control que se va a validar.
   * @returns Verdadero si el control es inválido y ha sido tocado, de lo contrario, indefinido.
   */
  public isFormControlInvalid(controlName: string): boolean | undefined {
    return (
      this.failureTypeForm.get(controlName)?.invalid &&
      this.failureTypeForm.get(controlName)?.touched
    );
  }

  /**
   * Envía el formulario del cliente para crear un nuevo registro o actualizar uno existente.
   * Determina si se debe llamar a la función de confirmación de creación o actualización del cliente.
   */
  public processFailureTypeForm(): void {
    if (!this.config.data) {
      this.confirmCreateFailureType();
    } else {
      this.confirmUpdateFailureType();
    }
  }

  /**
   * Cierra el formulario de clientes.
   * Muestra un diálogo de confirmación antes de cerrar.
   */
  public closeFailureTypeForm(): void {
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
   * Crea un nuevo registro de tipos de fallas.
   * Muestra un diálogo de confirmación antes de realizar la operación.
   */
  public confirmCreateFailureType(): void {
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
        this.failureTypeService.create(this.failureTypeForm.value).subscribe({
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
                detail: 'El tipo de falla ya existe',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al crear el tipo de falla',
              });
            }
          },
        });
      },
    });
  }

  /**
   * Actualiza el registro de tipos de fallas.
   * Muestra un diálogo de confirmación antes de realizar la operación.
   */
  public confirmUpdateFailureType(): void {
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
        this.failureTypeService
          .update(this.config.data?.id, this.failureTypeForm.value)
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
                  detail: 'Tipo de falla no encontrado',
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Ocurrió un error al actualizar el tipo de falla',
                });
              }
            },
          });
      },
    });
  }

  /**
   * Verifica si el usuario ha realizado modificaciones en el formulario de tipos de fallas.
   * @returns true si el formulario ha sido modificado; de lo contrario, false.
   */
  public hasFailureTypeFormChanged(): boolean {
    return !this.failureTypeForm.pristine;
  }
}
