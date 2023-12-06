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

  public ngOnInit(): void {
    if (this.config.data) this.loadForm(this.config.data);
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      //? Posible agregar el detalle de cada falla, para acceder
    });
  }

  private loadForm(failureType: IFailureType): void {
    this.failureTypeForm.patchValue(failureType);
    this.buttonLabel = 'ACTUALIZAR FORMULARIO';
  }

  public validateForm(controlName: string): boolean | undefined {
    return (
      this.failureTypeForm.get(controlName)?.invalid &&
      this.failureTypeForm.get(controlName)?.touched
    );
  }

  public submitForm(): void {
    !this.config.data ? this.createFailureType() : this.updateFailureType();
  }

  public cancelForm(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cancelar la operación?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'CANCELAR',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () => this.ref.close(),
    });
  }

  public createFailureType(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea crear el registro?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'CANCELAR',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () => {
        this.failureTypeService.create(this.failureTypeForm.value).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Operación exitosa',
              detail: 'El registro se creó',
            });
          },
          error: () => {},
          complete: () => this.ref.close(),
        });
      },
    });
  }

  public updateFailureType(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea actualizar el registro?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'CANCELAR',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () => {
        this.failureTypeService
          .update(this.config.data?.id, this.failureTypeForm.value)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'El registro se actualizó',
              });
            },
            error: () => {},
            complete: () => this.ref.close(),
          });
      },
    });
  }

  public getChangesToUpdate(): boolean {
    return !this.failureTypeForm.pristine;
  }
}
