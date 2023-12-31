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
    if (this.config.data) {
      this.loadForm(this.config.data);
      this.buttonLabel = 'ACTUALIZAR FORMULARIO';
    }
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(60)]],
      description: [null, [Validators.maxLength(250)]],
    });
  }

  private loadForm(failureType: IFailureType): void {
    this.failureTypeForm.patchValue(failureType);
  }

  public validateForm(controlName: string): boolean | undefined {
    return (
      this.failureTypeForm.get(controlName)?.invalid &&
      this.failureTypeForm.get(controlName)?.touched
    );
  }

  public submitForm(): void {
    if (!this.config.data) {
      this.createFailureType();
    } else {
      this.updateFailureType();
    }
  }

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

  public getChangesToUpdate(): boolean {
    return !this.failureTypeForm.pristine;
  }
}
