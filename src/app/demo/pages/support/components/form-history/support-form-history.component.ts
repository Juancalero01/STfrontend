import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
  //TODO: El minDate debe estar en varios pasos primero cuando es nuevo el caso el minDate es el mismo dia que se creo
  //TODO: Luego el minDate tiene que ser la fecha en la que se cambio el estado.
  public minDate: Date = new Date(this.config.data.dateEntry);
  public maxDate: Date = this.today;

  public ngOnInit(): void {
    this.setDefaultFormData();
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

  //TODO: SE DEBE MEJORAR SEGUN LO PEDIDO, EN LOS PRIMEROS 3 SIEMPRE APARECERA EL CANCELADO
  //TODO: CUANDO ESTE EN FASE DE ANALISIS, SE TENDRA EN CUENTA 4 ESTADOS LOS ESPERA DE COTI, ESPERA DE REPUESTOS, NO SE REPARA, EN REPARACIÓN.
  //TODO: LUEGO DE TODO ESO SIMPLEMENTE MOSTRAR DE UNA OPCION HASTA LLEGAR A CERRADO NO SE MUESTRA MAS OPCIONES.
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
          optionsToShow = 4;
        } else {
          optionsToShow = 1;
        }
        this.nextStates = this.nextStates.filter((state) => {
          return (
            state.id !== stateCurrentValue &&
            state.id > stateCurrentValue &&
            (optionsToShow-- > 0 || state.id === 12)
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
      stateCurrent: [{ value: null, disabled: true }],
      stateNext: [null, [Validators.required]],
      remarks: [null, [Validators.required]],
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
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'CANCELAR',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () => this.ref.close(),
    });
  }

  //TODO: Corregir la funcionalidad ya que da error al momento de modificar el estado
  //todo: SE DEBERA BUSCAR CUAL ES EL MOTIVO POR LA CUAL NO QUIERE ACTUALIZAR EL ESTADO AL SERVICIO.
  public saveForm(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea guardar los cambios?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'CANCELAR',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () => {
        this.supportHistoryService
          .create(this.supportHistoryForm.getRawValue())
          .subscribe({
            next: () => {
              this.supportService
                .updateState(
                  this.config.data.id,
                  this.supportHistoryForm.get('stateNext')?.value
                )
                .subscribe({
                  next: () => {
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Operación exitosa',
                      detail: 'El registro se creó correctamente',
                    });
                  },
                  error: (error) => {
                    console.log(error);
                  },
                  complete: () => {
                    this.ref.close();
                  },
                });
            },
            error: () => {},
            complete: () => {},
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

  //? posible solución
  // private getStateData(): ISupportState {
  //   return this.supportHistoryForm.get('stateNext')?.value;
  // }
}
