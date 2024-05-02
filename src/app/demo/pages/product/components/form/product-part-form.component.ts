import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IProductPartType } from 'src/app/demo/api/interfaces/product-part-type.interface';
import { IProductPart } from 'src/app/demo/api/interfaces/product-part.interface';
import { ProductPartTypeService } from 'src/app/demo/api/services/product-part-type.service';
import { ProductPartService } from 'src/app/demo/api/services/product-part.service';

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
              [options]="productPartTypes"
              [filter]="true"
              [ngClass]="{
                'ng-invalid ng-dirty': isFormControlInvalid('productPartType')
              }"
              [showClear]="true"
              (onChange)="onProductPartTypeChange()"
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
              formControlName="serial"
              placeholder="Ingresar número de serie de parte del producto"
              class="w-full"
              [minlength]="12"
              [maxlength]="13"
              [ngClass]="{
                'ng-invalid ng-dirty': isFormControlInvalid('serial')
              }"
            />
            <small *ngIf="isFormControlInvalid('serial')" class="p-error">
              Campo requerido*
            </small>
          </div>
        </section>

        <p-divider></p-divider>

        <section class="flex justify-content-end gap-2">
          <p-button
            label="Salir"
            styleClass="p-button-secondary w-full p-button-sm"
            (onClick)="closeProductPartForm()"
          />
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
    private readonly formBuilder: FormBuilder,
    private readonly productPartTypeService: ProductPartTypeService,
    private readonly productPartService: ProductPartService,
    private readonly config: DynamicDialogConfig
  ) {}

  public productPartForm: FormGroup = this.buildProductPartForm();
  public productPartTypes: IProductPartType[] = [];

  ngOnInit(): void {
    this.getProductPartTypes();
  }

  public buildProductPartForm(): FormGroup {
    return this.formBuilder.group({
      productPartType: [null, [Validators.required]],
      serial: [null, [Validators.required]],
    });
  }

  public isFormControlInvalid(controlName: string): boolean | undefined {
    const control = this.productPartForm.get(controlName);
    return control?.invalid && (control?.touched || control?.pristine);
  }

  public hasProductPartFormChanged(): boolean {
    return !this.productPartForm.pristine;
  }

  public sendNewProductPart(): void {
    if (this.productPartForm.valid) {
      const prefix = this.productPartForm.get('productPartType')?.value.prefix;
      const serial = this.productPartForm.get('serial')?.value;

      this.productPartService.findOneSerial(serial).subscribe({
        next: (productPart: IProductPart) => {
          if (
            productPart ||
            this.config.data.find(
              (productPart: IProductPart) =>
                productPart.serial === serial &&
                productPart.productPartType.prefix === prefix
            )
          ) {
            this.messageService.add({
              severity: 'error',
              summary: 'Operación denegada',
              detail: 'Número de serie ya registrado',
            });
          } else if (serial.startsWith(serial.slice(0, 4) + prefix)) {
            this.ref.close(this.productPartForm.getRawValue());
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Operación denegada',
              detail: 'Número de serie incorrecto para este tipo de parte',
            });
          }
        },
      });
    }
  }

  private getProductPartTypes(): void {
    this.productPartTypeService.findAll().subscribe({
      next: (productPartTypes: IProductPartType[]) =>
        (this.productPartTypes = productPartTypes),
    });
  }

  //todo: Modificar para cuando sean solo 3 caracteres se borre al momento de cambiar de tipo de parte, el resto queda igual
  public onProductPartTypeChange(): void {
    const productPartTypeId =
      this.productPartForm.get('productPartType')?.value?.id;

    const productPartType = this.productPartTypes.find(
      (type) =>
        type.id === productPartTypeId &&
        type.prefix !== null &&
        type.prefix !== undefined
    );
    if (productPartType) {
      const currentSerialValue = this.productPartForm.get('serial')?.value;
      const newSerialValue =
        currentSerialValue !== null
          ? `${currentSerialValue?.slice(0, 4)}${
              productPartType.prefix
            }${currentSerialValue?.slice(7)}` || ''
          : `${productPartType.prefix}`;
      this.productPartForm.get('serial')?.setValue(newSerialValue);
    } else {
      this.productPartForm.get('serial')?.setValue(null);
    }
  }

  public closeProductPartForm(): void {
    this.ref.close();
  }
}
