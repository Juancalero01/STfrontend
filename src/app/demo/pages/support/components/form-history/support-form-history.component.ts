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
    private readonly confirmationService: ConfirmationService,
    private readonly supportHistoryService: SupportHistoryService,
    private readonly supportNoteService: SupportNoteService,
    private readonly supportService: SupportService,
    private readonly tokenService: TokenService,
    private readonly messageService: MessageService
  ) {}

  public supportHistoryForm: FormGroup = this.buildSupportHistoryForm();
  public supportHistoryNoteForm: FormGroup = this.buildSupportHistoryNoteForm();
  public currentStates: ISupportState[] = [];
  public nextStates: ISupportState[] = [];
  public notes: ISupportNote[] = [];
  public today: Date = new Date();
  public minDate: Date = new Date(this.config.data.dateEntry);
  public maxDate: Date = this.today;
  public showHours: boolean = false;

  ngOnInit(): void {
    this.setDefaultFormData();
    this.findLastDateEntry();
    this.loadStates();
    this.loadForm(this.config.data);
    this.loadNotes();
  }

  /**
   * Realiza la carga de datos esenciales en el formulario principal de cambios de estado.
   * Asigna el estado actual, el servicio asociado y el usuario actual al formulario, preparándolo para su modificación.
   */
  private loadForm(data: ISupport): void {
    this.supportHistoryForm.patchValue({
      stateCurrent: data.state.id,
      service: data,
      user: Number(this.tokenService.getUserId()),
    });
  }

  /**
   * Carga las notas asociadas al servicio para visualizar en el formulario de notas.
   * Obtiene el historial más reciente del servicio y verifica si coincide con el estado actual del servicio.
   * Si coinciden, carga las notas correspondientes al historial y las asigna para su visualización.
   */

  private loadNotes(): void {
    const serviceId = this.config.data.id;
    this.supportHistoryService.findLastHistory(serviceId).subscribe({
      next: (supportHistory: ISupportHistory) => {
        if (supportHistory.stateCurrent.id === this.config.data.state.id) {
          this.supportNoteService
            .findByServiceHistory(supportHistory.id)
            .subscribe({
              next: (notes: ISupportNote[]) => {
                this.notes = notes;
              },
            });
        }
      },
    });
  }

  /**
   * Configura las opciones de selección según el estado actual del formulario.
   * Determina qué selecciones mostrar o no dependiendo del estado actual del formulario.
   */
  private loadStates(): void {
    this.supportStateService.findAll().subscribe({
      next: (states: ISupportState[]) => {
        this.currentStates = states;
        const stateCurrentValue =
          this.supportHistoryForm.get('stateCurrent')?.value;
        let optionsToShow = 1;
        if ([1, 2].includes(stateCurrentValue)) {
          this.nextStates = states.filter((state) =>
            [stateCurrentValue + 1, 13].includes(state.id)
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

  /**
   * Establece los datos predeterminados necesarios para completar el formulario principal de cambios de estado.
   * Esta función se ejecuta de forma automática para cargar los datos de manera oculta, sin intervención del usuario.
   */
  private setDefaultFormData(): void {
    this.supportHistoryForm.get('dateEntry')?.setValue(this.today);
  }

  /**
   * Construye y devuelve un FormGroup para el formulario de historial del servicio.
   * Este FormGroup contiene controles para capturar la información del historial del servicio,
   * aplicando validaciones a cada campo según los requisitos especificados.
   */
  private buildSupportHistoryForm(): FormGroup {
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

  /**
   * Construye y devuelve un FormGroup para el formulario de notas del historial del servicio.
   * Este FormGroup contiene controles para capturar la información de las notas del historial de servicio,
   * aplicando validaciones a cada campo según los requisitos especificados.
   */
  private buildSupportHistoryNoteForm(): FormGroup {
    return this.formBuilder.group({
      dateEntry: [null],
      comment: [null, [Validators.required, Validators.maxLength(500)]],
      serviceHistory: [null],
      state: [null],
      user: [null],
    });
  }

  /**
   * Cierra el formulario de historial de soportes.
   * Muestra un diálogo de confirmación antes de cerrar.
   */
  public closeSupportHistoryForm(): void {
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

  /**
   * Valida un control específico del formulario del historial de soporte.
   * Comprueba si el control especificado es inválido y ha sido tocado.
   * @param controlName El nombre del control que se va a validar.
   * @returns Verdadero si el control es inválido y ha sido tocado, de lo contrario, indefinido.
   */
  public validateSupportHistoryForm(controlName: string): boolean | undefined {
    return (
      this.supportHistoryForm.get(controlName)?.invalid &&
      this.supportHistoryForm.get(controlName)?.touched
    );
  }

  /**
   * Valida un control específico del formulario de las notas del historial de soporte.
   * Comprueba si el control especificado es inválido y ha sido tocado.
   * @param controlName El nombre del control que se va a validar.
   * @returns Verdadero si el control es inválido y ha sido tocado, de lo contrario, indefinido.
   */
  public validateSupportHistoryNoteForm(
    controlName: string
  ): boolean | undefined {
    return (
      this.supportHistoryNoteForm.get(controlName)?.invalid &&
      this.supportHistoryNoteForm.get(controlName)?.touched
    );
  }

  /**
   * Obtiene la fecha de entrada del último servicio y la compara con la fecha mínima permitida en el calendario.
   * Se asegura de que la fecha mínima no retroceda en el tiempo.
   * Esta función se ejecuta para establecer la fecha mínima permitida en el calendario según el historial de servicios del caso.
   */
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

  /**
   * Verifica si hay un estado específico en el historial de estados del servicio.
   * @param stateIdToCheck El ID del estado que se desea verificar en el historial.
   * @returns true si se encuentra el estado especificado en el historial, de lo contrario, false.
   */
  private getCheckHistoryState(stateIdToCheck: number): boolean {
    if (this.config.data.serviceHistory) {
      return this.config.data.serviceHistory.some(
        (history: ISupportHistory) => history.stateCurrent.id === stateIdToCheck
      );
    }
    return false;
  }

  /**
   * Guarda la información de las notas asociadas al estado actual del servicio.
   * Si ya existe un historial de estados para el servicio y el estado actual es el mismo que el del formulario,
   * se guarda la nota en ese historial. En caso contrario, se crea un nuevo historial de estado antes de guardar la nota.
   */
  public saveFormNote() {
    this.setDataNoteDefault();
    this.confirmationService.confirm({
      message: '¿Está seguro que desea guardar la nota?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      rejectLabel: 'CANCELAR',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-sm p-button-info',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
      accept: () => {
        const serviceId = this.config.data.id;
        const body = this.getDataSupportHistory();
        this.supportHistoryService.findLastHistory(serviceId).subscribe({
          next: (supportHistory: ISupportHistory) => {
            if (supportHistory) {
              if (
                supportHistory.stateCurrent.id === this.config.data.state.id
              ) {
                this.supportHistoryNoteForm.patchValue({
                  serviceHistory: supportHistory.id,
                });
                this.supportNoteService
                  .create(this.supportHistoryNoteForm.value)
                  .subscribe({
                    complete: () => {
                      this.loadNotes();
                      this.supportHistoryNoteForm.reset();
                    },
                  });
              } else {
                this.supportHistoryService.create(body).subscribe({
                  next: () => {
                    this.supportHistoryService
                      .findLastHistory(serviceId)
                      .subscribe({
                        next: (supportHistory: ISupportHistory) => {
                          this.supportHistoryNoteForm.patchValue({
                            serviceHistory: supportHistory.id,
                          });
                          this.supportNoteService
                            .create(this.supportHistoryNoteForm.value)
                            .subscribe({
                              next: () => {
                                this.loadNotes();
                                this.supportHistoryNoteForm.reset();
                              },
                            });
                        },
                      });
                  },
                });
              }
            } else {
              this.supportHistoryService.create(body).subscribe({
                next: () => {
                  this.supportHistoryService
                    .findLastHistory(serviceId)
                    .subscribe({
                      next: (supportHistory: ISupportHistory) => {
                        this.supportHistoryNoteForm.patchValue({
                          serviceHistory: supportHistory.id,
                        });
                        this.supportNoteService
                          .create(this.supportHistoryNoteForm.value)
                          .subscribe({
                            next: () => {
                              this.loadNotes();
                              this.supportHistoryNoteForm.reset();
                            },
                          });
                      },
                    });
                },
              });
            }
          },
        });
      },
    });
  }

  /**
   * Guarda la información del cambio de estado del servicio.
   * Actualiza el estado del servicio y algunos campos relacionados.
   */
  public saveForm(): void {
    const service = this.config.data;
    const { repairedTime, ...body } = this.supportHistoryForm.getRawValue();
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
        this.supportHistoryService.findLastHistory(service.id).subscribe({
          next: (supportHistory: ISupportHistory) => {
            if (
              supportHistory &&
              supportHistory.stateCurrent.id === service.state.id
            ) {
              this.supportHistoryService
                .update(supportHistory.id, body)
                .subscribe({
                  next: () => {
                    this.supportService
                      .updateState(service.id, body.stateNext)
                      .subscribe({
                        next: () => {
                          if (body.stateCurrent === 6) {
                            const currentRepairedTime =
                              this.config.data.repairedTime;
                            const newRepairedTime =
                              currentRepairedTime === null
                                ? +repairedTime
                                : +currentRepairedTime + +repairedTime;

                            this.supportService
                              .setRepairedTime(service.id, newRepairedTime)
                              .subscribe();
                          } else if (body.stateCurrent === 11) {
                            this.supportService
                              .setDateDeparture(service.id, new Date())
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
            } else if (
              !supportHistory ||
              supportHistory.stateCurrent.id !== service.state.id
            ) {
              this.supportHistoryService.create(body).subscribe({
                next: () => {
                  this.supportService
                    .updateState(service.id, body.stateNext)
                    .subscribe({
                      next: () => {
                        if (body.stateCurrent === 6) {
                          const currentRepairedTime =
                            this.config.data.repairedTime;
                          const newRepairedTime =
                            currentRepairedTime === null
                              ? +repairedTime
                              : +currentRepairedTime + +repairedTime;

                          this.supportService
                            .setRepairedTime(service.id, newRepairedTime)
                            .subscribe();
                        } else if (body.stateCurrent === 11) {
                          this.supportService
                            .setDateDeparture(service.id, new Date())
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
            }
          },
        });
      },
    });
  }

  /**
   * Establece los datos predeterminados para añadir una nota de forma automática.
   * Estos datos se configuran de forma oculta para el usuario.
   */
  private setDataNoteDefault() {
    this.supportHistoryNoteForm.patchValue({
      dateEntry: this.today,
      user: this.tokenService.getUserId(),
      state: this.config.data.state,
    });
  }

  /**
   * Obtiene la información del formulario de historial de soporte, excluyendo el tiempo de reparación
   * ya que la mayoría de los estados no lo requieren (solo un estado lo requiere).
   * @returns La información del formulario de historial de soporte sin el tiempo de reparación.
   */
  private getDataSupportHistory() {
    const { repairedTime, ...dataSend } = this.supportHistoryForm.getRawValue();
    return dataSend;
  }
}
