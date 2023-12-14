import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IClient } from 'src/app/demo/api/interfaces/client.interface';
import { IProvince } from 'src/app/demo/api/interfaces/province.interface';
import { ITaxCondition } from 'src/app/demo/api/interfaces/tax-condition.interface';
import { TaxConditionService } from 'src/app/demo/api/services/tax-condition.service';
import { ProvinceService } from 'src/app/demo/api/services/province.service';
import { ClientService } from 'src/app/demo/api/services/client.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
})
export class ClientFormComponent {
  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly formBuilder: FormBuilder,
    private readonly provinceService: ProvinceService,
    private readonly taxConditionService: TaxConditionService,
    private readonly clientService: ClientService
  ) {}

  public clientForm: FormGroup = this.buildForm();
  public provinces: IProvince[] = [];
  public taxConditions: ITaxCondition[] = [];
  public buttonLabel: string = 'REGISTRAR FORMULARIO';

  public ngOnInit(): void {
    this.getProvinces();
    this.getTaxConditions();
    this.config.data ? this.loadForm(this.config.data) : null;
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      taxpayerName: [null, [Validators.required]],
      taxpayerId: [null, [Validators.maxLength(13)]],
      taxpayerEmail: [null, [Validators.email, Validators.maxLength(120)]],
      taxpayerPhone: [null, [Validators.maxLength(20)]],
      street: [null, [Validators.maxLength(150)]],
      number: [null, [Validators.maxLength(10)]],
      floor: [null, [Validators.maxLength(10)]],
      office: [null, [Validators.maxLength(10)]],
      postalCode: [null, [Validators.maxLength(8)]],
      contactName: [null, [Validators.maxLength(120)]],
      contactEmail: [null, [Validators.email, Validators.maxLength(120)]],
      contactPhone: [null, [Validators.maxLength(20)]],
      comment: [null, [Validators.maxLength(250)]],
      taxCondition: [null],
      province: [null],
    });
  }

  private loadForm(client: IClient): void {
    this.clientForm.patchValue(client);
    this.clientForm.get('taxCondition')?.setValue(client.taxCondition?.id);
    this.clientForm.get('province')?.setValue(client.province?.id);
    this.buttonLabel = 'ACTUALIZAR FORMULARIO';
  }

  private getProvinces(): void {
    this.provinceService.findAll().subscribe({
      next: (provinces: IProvince[]) => (this.provinces = provinces),
    });
  }

  private getTaxConditions(): void {
    this.taxConditionService.findAll().subscribe({
      next: (taxConditions: ITaxCondition[]) =>
        (this.taxConditions = taxConditions),
    });
  }

  public validateForm(controlName: string): boolean | undefined {
    return (
      this.clientForm.get(controlName)?.invalid &&
      this.clientForm.get(controlName)?.touched
    );
  }

  public submitForm(): void {
    !this.config.data ? this.createClient() : this.updateClient();
  }

  public closeForm(): void {
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

  public createClient(): void {
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
        this.clientService.create(this.clientForm.value).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Operación exitosa',
              detail: 'Registro creado correctamente',
            });
          },
          error: () => {},
          complete: () => this.ref.close(),
        });
      },
    });
  }

  public updateClient(): void {
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
        this.clientService
          .update(this.config.data?.id, this.clientForm.value)
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
    return !this.clientForm.pristine;
  }
}
