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

  public failureTypeForm: FormGroup = this.buildForm();
  public buttonLabel: string = 'REGISTRAR FORMULARIO';

  //Inicializador de funciones.
  ngOnInit(): void {
    if (this.config.data) {
      this.loadForm(this.config.data);
      this.buttonLabel = 'ACTUALIZAR FORMULARIO';
    }
  }

  //Construcción de los campos y validaciones del formulario principal de tipo de falals.
  private buildForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(60)]],
      description: [null, [Validators.maxLength(250)]],
    });
  }

  //Carga el formulario de tipo de fallas.
  private loadForm(failureType: IFailureType): void {
    this.failureTypeForm.patchValue(failureType);
  }

  //Validaciones del formulario de tipo de fallas.
  public validateForm(controlName: string): boolean | undefined {
    return (
      this.failureTypeForm.get(controlName)?.invalid &&
      this.failureTypeForm.get(controlName)?.touched
    );
  }

  //Guarda o actualiza la información del tipo de fallas.
  public submitForm(): void {
    if (!this.config.data) {
      this.createFailureType();
    } else {
      this.updateFailureType();
    }
  }

  //Cancela el formulario del tipo de fallas.
  public cancelForm(): void {
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

  //Guarda la información para una nueva falla.
  public createFailureType(): void {
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
        });
      },
    });
  }

  //Actualiza la información para la falla.
  public updateFailureType(): void {
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
          });
      },
    });
  }

  //Obtiene si realmente el usuario modifico el formulario de tipo de fallas.
  public getChangesToUpdate(): boolean {
    return !this.failureTypeForm.pristine;
  }
}
