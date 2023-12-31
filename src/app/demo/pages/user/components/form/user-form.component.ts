import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IRole } from 'src/app/demo/api/interfaces/role.interface';
import { IUser } from 'src/app/demo/api/interfaces/user.interface';
import { RoleService } from 'src/app/demo/api/services/role.service';
import { UserService } from 'src/app/demo/api/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent {
  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly formBuilder: FormBuilder
  ) {}

  public userForm: FormGroup = this.buildForm();
  public buttonLabel: string = 'REGISTRAR FORMULARIO';
  public buttonStatusLabel: string = '';
  public showButtons: boolean = false;
  public roles: IRole[] = [];

  public ngOnInit(): void {
    this.getRoles();
    if (this.config.data) {
      this.loadForm(this.config.data);
      this.showButtons = true;
      this.buttonLabel = 'ACTUALIZAR FORMULARIO';
    }
  }

  private getRoles(): void {
    this.roleService.findAll().subscribe({
      next: (roles: IRole[]) => {
        this.roles = roles;
      },
    });
  }

  public submitForm(): void {
    if (!this.config.data) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  public buildForm(): FormGroup {
    return this.formBuilder.group({
      username: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[a-z]+$/),
          Validators.maxLength(255),
        ],
      ],
      fullname: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z\s]+$/),
          Validators.maxLength(255),
        ],
      ],
      email: [null, [Validators.email, Validators.required]],
      password: [{ value: null, disabled: true }],
      role: [null, [Validators.required]],
    });
  }

  private loadForm(user: IUser): void {
    this.userForm.patchValue({
      ...user,
      role: user.role.id,
    });
    this.buttonStatusLabel = user.isActive
      ? 'DESHABILITAR USUARIO'
      : 'HABILITAR USUARIO';
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
      accept: () => {
        this.ref.close();
      },
    });
  }

  public createUser(): void {
    this.userForm.patchValue({
      password: this.userForm.get('username')?.value,
    });
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
        this.userService.create(this.userForm.getRawValue()).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Operación exitosa',
              detail: 'Registro creado correctamente',
            });
            this.ref.close();
          },
        });
      },
    });
  }

  public updateUser(): void {
    this.userForm.valueChanges;
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
        this.userService
          .update(this.config.data.id, this.userForm.value)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Operación exitosa',
                detail: 'Registro actualizado correctamente',
              });
              this.ref.close();
            },
          });
      },
    });
  }

  public resetPassword(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea restaurar la contraseña?',
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      rejectLabel: 'CANCELAR',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-sm p-button-info',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
      accept: () => {
        this.userService.resetPassword(this.config.data?.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Operación exitosa',
              detail: 'Contraseña reseteada correctamente',
            });
          },
          error: () => {},
          complete: () => {
            this.ref.close();
          },
        });
      },
    });
  }

  public changeState(): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea ${this.buttonStatusLabel
        .toLowerCase()
        .replace('usuario', '')} al usuario?`,
      header: 'CONFIRMAR',
      icon: 'pi pi-info-circle',
      acceptLabel: 'CONFIRMAR',
      rejectLabel: 'CANCELAR',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-sm p-button-info',
      rejectButtonStyleClass: 'p-button-sm p-button-secondary',
      accept: () => {
        this.userService.changeState(this.config.data?.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Operación exitosa',
              detail: 'Estado actualizado correctamente',
            });
            this.ref.close();
          },
        });
      },
    });
  }

  public getChangesToUpdate(): boolean {
    return !this.userForm.pristine;
  }

  public validateForm(controlName: string): boolean | undefined {
    return (
      this.userForm.get(controlName)?.invalid &&
      this.userForm.get(controlName)?.touched
    );
  }
}
