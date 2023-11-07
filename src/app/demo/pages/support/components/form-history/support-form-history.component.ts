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
  public currentStates: ISupportState[] = [];
  public nextStates: ISupportState[] = [];

  public ngOnInit(): void {
    this.setDefaultFormData();
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
      next: (states: ISupportState[]) => {
        this.currentStates = states;
        this.nextStates = states;

        const stateCurrentValue =
          this.supportHistoryForm.get('stateCurrent')?.value;
        let optionsToShow = 1;

        if (stateCurrentValue === 2) {
          optionsToShow = 3;
        } else if (stateCurrentValue === 3) {
          optionsToShow = 2;
        } else {
          optionsToShow = 1;
        }

        this.nextStates = this.nextStates.filter((state) => {
          return (
            state.id !== stateCurrentValue &&
            state.id > stateCurrentValue &&
            optionsToShow-- > 0
          );
        });

        // const stateCurrentValue =
        //   this.supportHistoryForm.get('stateCurrent')?.value;
        // let stateNextValue = stateCurrentValue;

        // let optionsToShow = 1;

        // if (stateCurrentValue === 2) {
        //   optionsToShow = 3;
        // } else if (stateCurrentValue === 3) {
        //   optionsToShow = 2;
        // } else {
        //   optionsToShow = 1;
        // }

        // this.nextStates = this.nextStates.filter((state) => {
        //   if (state.id === stateCurrentValue) {
        //     return false;
        //   }

        //   if (state.id <= stateNextValue) {
        //     return false;
        //   }

        //   if (optionsToShow > 0) {
        //     optionsToShow--;
        //     return true;
        //   }

        //   return false;
        // });
      },
    });
  }

  private setDefaultFormData(): void {
    this.supportHistoryForm
      .get('dateEntry')
      ?.setValue(new Date().toISOString().split('T')[0]);
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      dateEntry: [{ value: null, disabled: true }],
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

  public saveForm(): void {
    const formValue = this.supportHistoryForm.value;
    formValue.stateCurrent = this.supportHistoryForm.get('stateCurrent')?.value;
    (formValue.user = 1), console.log(formValue);
  }
}
