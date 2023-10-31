import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISupportState } from 'src/app/demo/api/interfaces/support-state.interface';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { SupportStateService } from 'src/app/demo/api/services/support-state.service';

@Component({
  selector: 'app-form-history',
  templateUrl: './support-form-history.component.html',
})
export class SupportFormHistoryComponent {
  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly formBuilder: FormBuilder,
    private readonly supportStateService: SupportStateService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  public supportHistoryForm: FormGroup = this.buildForm();
  public supportStatesDropdown: ISupportState[] = [];

  public ngOnInit(): void {
    this.loadStates();
    this.loadForm(this.config.data);
  }

  private loadForm(data: ISupport): void {
    this.supportHistoryForm.patchValue({
      reclaim: data.reclaim,
      stateCurrent: data.state.id,
      service: data,
    });
  }
  private loadStates(): void {
    this.supportStateService.findAll().subscribe({
      next: (supportStates: ISupportState[]) => {
        this.supportStatesDropdown = supportStates;
      },
      error: (e: any) => {
        if (e.status === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error de conexión con el servidor',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al cargar los estados',
            detail: 'Error al cargar los estados',
          });
        }
      },
    });
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      reclaim: [{ value: null, disabled: true }],
      stateCurrent: [{ value: null, disabled: true }],
      stateNext: [null, [Validators.required]],
      remarks: [null, [Validators.required]],
      service: [null, [Validators.required]],
    });
  }

  public exitForm(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea salir del formulario?',
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
}
