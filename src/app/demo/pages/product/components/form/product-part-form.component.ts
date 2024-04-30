import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

interface ProductPartType {
  id: number;
  name: string;
  code: string;
}

@Component({
  selector: 'app-product-part-form',
  template: `
    <section>
      <form [formGroup]="productPartForm" class="flex flex-column">
        <section class="flex flex-column gap-3">
          <div class="flex flex-column">
            <label>Tipo de parte*</label>
            <p-dropdown
              formControlName="productPartType"
              optionLabel="name"
              placeholder="Seleccionar la parte del producto"
              styleClass="w-full"
              [options]="productPartType"
              [filter]="true"
              [ngClass]="{
                'ng-invalid ng-dirty': isFormControlInvalid('productPartType')
              }"
              [showClear]="true"
            >
            </p-dropdown>
            <small
              *ngIf="isFormControlInvalid('productPartType')"
              class="p-error"
            >
              Campo requerido*
            </small>
          </div>
          <div class="flex flex-column">
            <label>Identificador de parte*</label>
            <input
              type="text"
              pInputText
              formControlName="hardwareId"
              placeholder="Ingresar número de identificador de parte del producto"
              class="w-full"
              [minlength]="1"
              [maxlength]="10"
              [ngClass]="{
                'ng-invalid ng-dirty': isFormControlInvalid('hardwareId')
              }"
            />
            <small *ngIf="isFormControlInvalid('hardwareId')" class="p-error">
              Campo requerido*
            </small>
          </div>
        </section>

        <p-divider></p-divider>

        <!-- buttons -->
        <section class="flex justify-content-end gap-2">
          <p-button
            label="Añadir"
            [disabled]="productPartForm.invalid || !hasProductPartFormChanged()"
            styleClass="p-button-info w-full p-button-sm"
            (onClick)="sendNewProductPart()"
          />
        </section>
      </form>
    </section>
  `,
})
export class ProductPartFormComponent {
  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly formBuilder: FormBuilder
  ) {}

  public productPartForm: FormGroup = this.buildProductPartForm();

  // CONSTANTE DE TIPOS DE PARTE SOLAMENTE PARA TESTEO.
  //TODO : Luego eliminar esto cuando los datos vengan de la api

  public productPartType: ProductPartType[] = [
    {
      id: 1,
      name: 'Módulos GSM Saeta 3xx',
      code: '002',
    },
    {
      id: 2,
      name: 'Carriers',
      code: '006',
    },
  ];

  public buildProductPartForm(): FormGroup {
    return this.formBuilder.group({
      productPartType: [null, [Validators.required]],
      hardwareId: [null, [Validators.required]],
    });
  }

  public isFormControlInvalid(controlName: string): boolean | undefined {
    const control = this.productPartForm.get(controlName);
    return control?.invalid && (control?.touched || control?.pristine);
  }

  public hasProductPartFormChanged(): boolean {
    return !this.productPartForm.pristine;
  }

  public sendNewProductPart() {
    console.log(`Data enviada: ${this.productPartForm.getRawValue()}`);
    this.ref.close(this.productPartForm.getRawValue());
  }
}
