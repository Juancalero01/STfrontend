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
  public supports: ISupport[] = [];
  public supportMassiveForm: FormGroup = this.buildForm();
  public currentState: any;
  public nextState: any;

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

  //Cierra el formulario
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
        this.supports = [];
        this.ref.close();
      },
    });
  }

  //Valida el formulario
  public validateForm(controlName: string): boolean | undefined {
    return (
      this.supportMassiveForm.get(controlName)?.invalid &&
      this.supportMassiveForm.get(controlName)?.touched
    );
  }

  //Carga y asigna los estados necesarios
  private loadStates(): void {
    this.supportStateService.findAll().subscribe({
      next: (states: ISupportState[]) => {
        this.currentState = states.find((state) => state.id === 11);
        this.nextState = states.find((state) => state.id === 12);
      },
    });
  }

  //Guarda el cambio de historial y actualiza el servicio en general
  public saveForm(): void {
    this.loadSupportsHistories(this.config.data);
    this.loadSupportsUpdate(this.config.data);
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
        this.supportService.updateMany(this.supports).subscribe({
          next: () => {
            this.supportHistoryService
              .createMany(this.supportsHistories)
              .subscribe({
                next: () => {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Operación exitosa',
                    detail: 'Los servicios se cerraron correctamente',
                  });
                  this.ref.close();
                },
              });
          },
        });
      },
    });
  }

  private loadSupportsHistories(supports: ISupport[]): void {
    const remarks = this.supportMassiveForm.get('remarks')?.value;
    const userId = Number(this.tokenService.getUserId());
    const currentDate = new Date();
    const supportsLength = supports.length;
    this.supportsHistories = [];
    for (let i = 0; i < supportsLength; i++) {
      let supportHistory: ISupportHistoryMany = {
        dateEntry: currentDate,
        stateCurrent: this.currentState,
        stateNext: this.nextState,
        remarks: remarks,
        service: supports[i],
        user: userId,
      };
      this.supportsHistories.push(supportHistory);
    }
  }

  private loadSupportsUpdate(supports: ISupport[]): void {
    const endReference: string =
      this.supportMassiveForm.get('endReference')?.value;
    const supportsLength: number = supports.length;
    this.supports = [];
    for (let i = 0; i < supportsLength; i++) {
      let support = supports[i];
      support.endReference = endReference;
      support.state = this.nextState;
      this.supports.push(support);
    }
  }
}
