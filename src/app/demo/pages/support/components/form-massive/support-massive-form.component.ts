import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISupportHistoryMany } from 'src/app/demo/api/interfaces/support-history.interface';
import { ISupportState } from 'src/app/demo/api/interfaces/support-state.interface';
import { ISupport } from 'src/app/demo/api/interfaces/support.interface';
import { SupportHistoryService } from 'src/app/demo/api/services/support-history.service';
import { SupportStateService } from 'src/app/demo/api/services/support-state.service';
import { SupportService } from 'src/app/demo/api/services/support.service';
import { TokenService } from 'src/app/demo/api/services/token.service';

@Component({
  selector: 'app-support-massive-form',
  templateUrl: './support-massive-form.component.html',
})
export class SupportMassiveFormComponent {
  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly formBuilder: FormBuilder,
    private readonly supportStateService: SupportStateService,
    private readonly confirmationService: ConfirmationService,
    private readonly supportHistoryService: SupportHistoryService,
    private readonly supportService: SupportService,
    private readonly messageService: MessageService,
    private readonly tokenService: TokenService
  ) {}

  public supportsHistories: ISupportHistoryMany[] = [];
  public supportMassiveForm: FormGroup = this.buildForm();
  public currentState?: ISupportState;
  public nextState?: ISupportState;

  ngOnInit(): void {
    this.loadStates();
  }

  //Solo comentario para cerrar todos los casos, se aplica para cada servicio del array.
  private buildForm(): FormGroup {
    return this.formBuilder.group({
      endReference: [
        null,
        [
          Validators.minLength(15),
          Validators.pattern(/^[0-9]{4}-R-[0-9]{8}$/),
          Validators.required,
        ],
      ],
      remarks: [null, [Validators.required, Validators.maxLength(500)]],
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
      accept: () => {
        this.supportsHistories = [];
        this.ref.close();
      },
    });
  }

  public validateForm(controlName: string): boolean | undefined {
    return (
      this.supportMassiveForm.get(controlName)?.invalid &&
      this.supportMassiveForm.get(controlName)?.touched
    );
  }

  private loadStates(): void {
    this.supportStateService.findAll().subscribe({
      next: (states: ISupportState[]) => {
        this.currentState = states.find((state) => state.id === 11);
        this.nextState = states.find((state) => state.id === 12);
      },
    });
  }

  public saveForm(): void {
    this.loadSupportsHistories(this.config.data);

    //Aca configurar el formulario para que guarde luego crear una nueva funcionalidad para que actualicce los estados del servicio.
    //Estas dos cosas son servicios por lo tanto en la API se deben crear dos endpoints nuevos.
    //Verificar que no se rompa nada, si se rompe posiblemente puede ser la fecha.
    //Estar al tanto de las variables.

    //Hay que crear una funcionalidad para que solo actualice el estado y el endReference del formulario general de esos servicios, probar
    //masivamente.
  }

  private loadSupportsHistories(supports: ISupport[]): void {
    this.supportsHistories = [];

    supports.forEach((support: ISupport) => {
      const supportHistory: ISupportHistoryMany = {
        dateEntry: new Date(),
        stateCurrent: this.currentState,
        stateNext: this.nextState,
        remarks: this.supportMassiveForm.get('remarks')?.value,
        service: support,
        user: Number(this.tokenService.getUserId()),
      };
      this.supportsHistories.push(supportHistory);
    });

    console.log(this.supportsHistories);
  }
}
