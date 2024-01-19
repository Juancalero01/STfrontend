import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISupportHistory } from 'src/app/demo/api/interfaces/support-history.interface';
import { ISupportNote } from 'src/app/demo/api/interfaces/support-note.interface';
import { ISupportState } from 'src/app/demo/api/interfaces/support-state.interface';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { SupportHistoryService } from 'src/app/demo/api/services/support-history.service';
import { SupportNoteService } from 'src/app/demo/api/services/support-note.service';
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
    private readonly supportNoteService: SupportNoteService,
    private readonly supportService: SupportService,
    private readonly tokenService: TokenService
  ) {}

  public supportHistoryForm: FormGroup = this.buildForm();
  public supportHistoryNoteForm: FormGroup = this.buildFormNote();
  public currentStates: ISupportState[] = [];
  public nextStates: ISupportState[] = [];
  public notes: ISupportNote[] = [];
  public today: Date = new Date();
  public minDate: Date = new Date(this.config.data.dateEntry);
  public maxDate: Date = this.today;
  public showHours: boolean = false;

  public ngOnInit(): void {
    this.setDefaultFormData();
    this.findLastDateEntry();
    this.loadStates();
    this.loadForm(this.config.data);
    this.loadNotes();
  }

  private loadForm(data: ISupport): void {
    this.supportHistoryForm.patchValue({
      stateCurrent: data.state.id, //!EL ESTADO QUE SE OBTIENE ES DEL SERVICIO Y NO DEL CAMBIO DEL HISTORIAL.
      service: data, //!LA DATA DEL SERVICE SERIA EL ID O REFERENCIA DE ESE MISMO SERVICE.
      user: Number(this.tokenService.getUserId()), //!LO OBTENEMOS MEDIANTE EL TOKEN, PRACTICAMENTE MEDIANTE EL serviceTOKEN.
    });
  }

  private loadNotes(): void {
    this.supportNoteService
      .findByServiceHistory(
        this.getLastServiceHistory(this.config.data.serviceHistory)
      )
      .subscribe({
        next: (notes: ISupportNote[]) => {
          this.notes = notes;
        },
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
          this.nextStates = states.filter((state) => [10].includes(state.id));
          return;
        } else if (stateCurrentValue === 9) {
          this.nextStates = states.filter((state) =>
            [6, 10].includes(state.id)
          );
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

  private buildFormNote(): FormGroup {
    return this.formBuilder.group({
      dateEntry: [null],
      comment: [null, [Validators.required, Validators.maxLength(500)]],
      serviceHistory: [null],
      state: [null],
      user: [null],
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

  public validateForm(controlName: string): boolean | undefined {
    return (
      this.supportHistoryForm.get(controlName)?.invalid &&
      this.supportHistoryForm.get(controlName)?.touched
    );
  }

  public validateFormNote(controlName: string): boolean | undefined {
    return (
      this.supportHistoryNoteForm.get(controlName)?.invalid &&
      this.supportHistoryNoteForm.get(controlName)?.touched
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

  private getLastServiceHistory(supportHistory: ISupportHistory[]): number {
    return supportHistory[0].id;
  }

  //!TESTEO FALTA RESOLVER

  //!Se requiere que se haga una condición, en la cual primero verifique el ultimo historial
  //!Si el estado del ultimo historial es igual al estado actual del servicio entonces NO se deberia registrar, solamente deberia crear la nota.
  //!Del caso contrario si el ultimo historial es diferente del estado actual del servicio entonces SI se deberia registrar el historial, y luego
  //!crear el la nota con ese id del historial
  //!La idea es que el historial quede bien y las notas correspondan a su propio historial, recordar que hay que modificar los gets
  //!en varias oportunidades.

  public saveFormNote() {
    this.supportHistoryNoteForm.patchValue({
      dateEntry: this.today,
      user: this.tokenService.getUserId(),
      state: this.config.data.state,
    });
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
            this.supportHistoryService
              .findLastHistory(this.config.data.id)
              .subscribe({
                next: (supportHistory: ISupportHistory) => {
                  this.supportHistoryNoteForm.patchValue({
                    serviceHistory: supportHistory.id,
                  });
                  this.supportNoteService
                    .create({
                      ...this.supportHistoryNoteForm.value,
                    })
                    .subscribe({
                      next: () => {
                        this.loadNotes();
                      },
                    });
                },
              });
          },
        });
      },
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

        //!VERIFICAR CON UN IF SI YA EXISTE ESE SUPPORTHISTORY CON ESE STATECURRENT PARA QUE SOLAMENTE ACTUALICE SI ES QUE NO SE AGREGA UN COMENTARIO
        //!ENTONCES LO CREA Y REGISTRA EL CAMBIO DE ESTADO
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
                    const currentRepairedTime = this.config.data.repairedTime;
                    const newRepairedTime =
                      currentRepairedTime === null
                        ? +repairedTime
                        : +currentRepairedTime + +repairedTime;

                    this.supportService
                      .setRepairedTime(this.config.data.id, newRepairedTime)
                      .subscribe();
                  } else if (
                    this.supportHistoryForm.get('stateCurrent')?.value === 11
                  ) {
                    this.supportService
                      .setDateDeparture(this.config.data.id, new Date())
                      .subscribe();
                  }
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
      },
    });
  }
}
