import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISupportHistory } from 'src/app/demo/api/interfaces/support-history.interface';
import { ISupportState } from 'src/app/demo/api/interfaces/support-state.interface';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { SupportHistoryService } from 'src/app/demo/api/services/support-history.service';
import { SupportStateService } from 'src/app/demo/api/services/support-state.service';
import { SupportService } from 'src/app/demo/api/services/support.service';
import { TokenService } from 'src/app/demo/api/services/token.service';

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
    private readonly confirmationService: ConfirmationService,
    private readonly supportHistoryService: SupportHistoryService,
    private readonly supportService: SupportService,
    private readonly tokenService: TokenService
  ) {}

  public supportHistoryForm: FormGroup = this.buildForm();
  public currentStates: ISupportState[] = [];
  public nextStates: ISupportState[] = [];
  public today: Date = new Date();
  public minDate: Date = new Date(this.config.data.dateEntry);
  public maxDate: Date = this.today;
  public showHours: boolean = false;

  public ngOnInit(): void {
    this.setDefaultFormData();
    this.findLastDateEntry();
    this.loadStates();
    this.loadForm(this.config.data);
  }

  private loadForm(data: ISupport): void {
    this.supportHistoryForm.patchValue({
      stateCurrent: data.state.id,
      service: data,
      user: Number(this.tokenService.getUserId()),
    });
  }

  private loadStates(): void {
    this.supportStateService.findAll().subscribe({
      next: (states: ISupportState[]) => {
        this.currentStates = states;
        const stateCurrentValue =
          this.supportHistoryForm.get('stateCurrent')?.value;
        let optionsToShow = 1;
        if ([1, 2].includes(stateCurrentValue)) {
          this.nextStates = states.filter((state) =>
            [stateCurrentValue + 1, 12].includes(state.id)
          );
          return;
        } else if (stateCurrentValue === 3) {
          this.nextStates = states.filter(
            (state) =>
              state.id > stateCurrentValue && state.id <= stateCurrentValue + 4
          );
          return;
        } else if (stateCurrentValue === 4) {
          this.nextStates = states.filter((state) =>
            this.getCheckHistoryState(5)
              ? [6, 7].includes(state.id)
              : [5, 6, 7].includes(state.id)
          );

          return;
        } else if (stateCurrentValue === 5) {
          this.nextStates = states.filter((state) =>
            this.getCheckHistoryState(4)
              ? [6, 7].includes(state.id)
              : [4, 6, 7].includes(state.id)
          );
          return;
        } else if (stateCurrentValue === 6) {
          this.nextStates = states.filter((state) => [8].includes(state.id));
          this.showHours = true;
          this.supportHistoryForm.get('repairedTime')?.enable();

          this.supportHistoryForm
            .get('repairedTime')
            ?.addValidators([
              Validators.required,
              Validators.pattern(/^(?!00$|0$)[1-9]\d?$/),
            ]);
          return;
        } else if (stateCurrentValue === 7) {
          this.nextStates = states.filter((state) => [9].includes(state.id));
          return;
        } else {
          optionsToShow = 1;
        }
        this.nextStates = states.filter((state) => {
          return (
            state.id !== stateCurrentValue &&
            state.id > stateCurrentValue &&
            optionsToShow-- > 0
          );
        });
      },
    });
  }

  private setDefaultFormData(): void {
    this.supportHistoryForm.get('dateEntry')?.setValue(this.today);
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      dateEntry: [null, [Validators.required]],
      repairedTime: [{ value: null, disabled: true }],
      stateCurrent: [{ value: null, disabled: true }],
      stateNext: [null, [Validators.required]],
      remarks: [null, [Validators.required, Validators.maxLength(500)]],
      service: [null, [Validators.required]],
      user: [null, [Validators.required]],
    });
  }

  public exitForm(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea salir del formulario?',
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

  public saveForm(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea guardar los cambios?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      rejectLabel: 'CANCELAR',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-sm p-button-info',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
      accept: () => {
        const { repairedTime, ...dataSend } =
          this.supportHistoryForm.getRawValue();
        this.supportHistoryService.create(dataSend).subscribe({
          next: () => {
            this.supportService
              .updateState(
                this.config.data.id,
                this.supportHistoryForm.get('stateNext')?.value
              )
              .subscribe({
                next: () => {
                  if (
                    this.supportHistoryForm.get('stateCurrent')?.value === 6
                  ) {
                    this.supportService
                      .setRepairedTime(this.config.data.id, repairedTime)
                      .subscribe();
                  } else if (
                    this.supportHistoryForm.get('stateCurrent')?.value === 10
                  ) {
                    this.supportService
                      .setDateDeparture(this.config.data.id, new Date())
                      .subscribe();
                  }
                },
              });
          },
          complete: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Operación exitosa',
              detail: 'El estado se actualizo correctamente',
            });
            this.ref.close();
          },
        });
      },
    });
  }

  public validateForm(controlName: string): boolean | undefined {
    return (
      this.supportHistoryForm.get(controlName)?.invalid &&
      this.supportHistoryForm.get(controlName)?.touched
    );
  }

  private findLastDateEntry(): void {
    if (
      this.config.data.state.id !== 1 &&
      this.config.data.serviceHistory.length > 0
    ) {
      const lastSupportHistory =
        this.config.data.serviceHistory[
          this.config.data.serviceHistory.length - 1
        ];

      if (new Date(lastSupportHistory.dateEntry) > this.minDate) {
        this.minDate = new Date(lastSupportHistory.dateEntry);
      }
    }
  }

  private getCheckHistoryState(stateIdToCheck: number): boolean {
    if (this.config.data.serviceHistory) {
      return this.config.data.serviceHistory.some(
        (history: ISupportHistory) => history.stateCurrent.id === stateIdToCheck
      );
    }
    return false;
  }
}
