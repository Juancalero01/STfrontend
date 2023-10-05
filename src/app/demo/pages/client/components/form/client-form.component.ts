import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IClient } from 'src/app/demo/api/interfaces/client.interface';
import { IProvince } from 'src/app/demo/api/interfaces/province.interface';
import { ITaxCondition } from 'src/app/demo/api/interfaces/tax-condition.interface';
import { TaxConditionService } from 'src/app/demo/api/services/shared/tax-condition.service';
import { ProvinceService } from 'src/app/demo/api/services/shared/province.service';
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
  public provincesDropdown: IProvince[] = [];
  public taxConditionsDropdown: ITaxCondition[] = [];
  public buttonLabel: string = 'REGISTRAR';
  public blockSpace: RegExp = /[^\s]/;

  public ngOnInit(): void {
    this.loadProvinces();
    this.loadTaxConditions();
    if (this.config.data) this.loadForm(this.config.data);
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
    this.buttonLabel = 'ACTUALIZAR';
  }

  private loadProvinces(): void {
    this.provinceService.findAll().subscribe({
      next: (provinces: IProvince[]) => {
        this.provincesDropdown = provinces;
      },
      error: (e: Error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e.message,
        });
      },
    });
  }

  private loadTaxConditions(): void {
    this.taxConditionService.findAll().subscribe({
      next: (taxConditions: ITaxCondition[]) => {
        this.taxConditionsDropdown = taxConditions;
      },
      error: (e: Error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e.message,
        });
      },
    });
  }

  public validateForm(controlName: string): boolean | undefined {
    return (
      this.clientForm.get(controlName)?.invalid &&
      this.clientForm.get(controlName)?.touched
    );
  }

  public submitForm(): void {
    if (!this.config.data) this.createClient();
    else this.updateClient();
  }

  public cancelForm(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cancelar la operación?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'CANCELAR',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () => {
        this.ref.close();
        this.messageService.add({
          severity: 'info',
          summary: 'Operación cancelada',
          detail: 'La operación se canceló',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Operación cancelada',
          detail: 'La operación no se canceló',
        });
      },
    });
  }

  public createClient(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea crear el registro?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'CANCELAR',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
      accept: () => {
        this.clientService.create(this.clientForm.value).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Operación exitosa',
              detail: 'El registro se creó',
            });
          },
          error: (e: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Operación fallida',
              detail: e.error?.errorMessage,
            });
          },
          complete: () => {
            this.ref.close();
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Operación cancelada',
          detail: 'El registro no se creó',
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
      acceptButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-info',
      rejectLabel: 'CANCELAR',
      rejectButtonStyleClass:
        'p-button-rounded p-button-text p-button-sm font-medium p-button-secondary',
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
            error: (e: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Operación fallida',
                detail: e.error?.errorMessage,
              });
            },
            complete: () => {
              this.ref.close();
            },
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Opernación cancelada',
          detail: 'El registro no se actualizó',
        });
      },
    });
  }
}
