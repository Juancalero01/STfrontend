import { HttpErrorResponse } from '@angular/common/http';
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

  public userForm: FormGroup = this.buildUserForm();
  public buttonLabel: string = 'REGISTRAR FORMULARIO';
  public buttonStatusLabel: string = '';
  public showButtons: boolean = false;
  public roles: IRole[] = [];

  ngOnInit(): void {
    this.getRoles();
    if (this.config.data) {
      this.loadUserDataIntoForm(this.config.data);
      this.showButtons = true;
      this.buttonLabel = 'ACTUALIZAR FORMULARIO';
    }
  }

  //Obtiene los roles para visualizarlo mediante el seleccionable del formulario.
  private getRoles(): void {
    this.roleService.findAll().subscribe({
      next: (roles: IRole[]) => {
        this.roles = roles;
      },
    });
  }

  /**
   * Envía el formulario del usuario para crear un nuevo registro o actualizar uno existente.
   * Determina si se debe llamar a la función de confirmación de creación o actualización del usuario.
   */
  public processUserForm(): void {
    if (!this.config.data) {
      this.confirmCreateUser();
    } else {
      this.confirmUpdateUser();
    }
  }

  /**
   * Construye y devuelve un FormGroup para el formulario de usuarios.
   * Este FormGroup contiene controles para capturar la información del usuario,
   * aplicando validaciones a cada campo según los requisitos especificados.
   */
  public buildUserForm(): FormGroup {
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

  /**
   * Carga los datos del usuario en el formulario correspondiente.
   * Utiliza los datos del usuario proporcionados para completar los campos del formulario,
   * asignando los valores de los campos a partir de la información del usuario.
   */
  private loadUserDataIntoForm(user: IUser): void {
    this.userForm.patchValue({
      ...user,
      role: user.role.id,
    });
    this.buttonStatusLabel = user.isActive
      ? 'DESHABILITAR USUARIO'
      : 'HABILITAR USUARIO';
  }

  /**
   * Cierra el formulario de usuarios.
   * Muestra un diálogo de confirmación antes de cerrar.
   */
  public closeUserForm(): void {
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

  /**
   * Crea un nuevo registro de usuario.
   * Muestra un diálogo de confirmación antes de realizar la operación.
   */
  public confirmCreateUser(): void {
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
          error: (err: HttpErrorResponse) => {
            if (err.status === 409) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El usuario ya existe',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al crear el usuario',
              });
            }
          },
        });
      },
    });
  }

  /**
   * Actualiza el registro de usuario.
   * Muestra un diálogo de confirmación antes de realizar la operación.
   */
  public confirmUpdateUser(): void {
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
            error: (err: HttpErrorResponse) => {
              if (err.status === 404) {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Usuario no encontrado',
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Ocurrió un error al actualizar el usuario',
                });
              }
            },
          });
      },
    });
  }

  /**
   * Restablece la contraseña del usuario (solo disponible en modo administrador).
   * Se muestra un cuadro de diálogo de confirmación antes de restablecer la contraseña.
   */
  public resetUserPassword(): void {
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
          error: (err: HttpErrorResponse) => {
            if (err.status === 404) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Usuario no encontrado',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al resetear la contraseña',
              });
            }
          },
          complete: () => {
            this.ref.close();
          },
        });
      },
    });
  }

  /**
   * Modifica el estado del usuario (Activo | Inactivo).
   * Se muestra un cuadro de diálogo de confirmación antes de realizar el cambio de estado.
   */
  public changeUserState(): void {
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
          error: (err: HttpErrorResponse) => {
            if (err.status === 404) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Usuario no encontrado',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al actualizar el estado del usuario',
              });
            }
          },
        });
      },
    });
  }

  //Obtiene si realmente el usuario modifico el formulario de usuarios.
  public hasUserFormChanged(): boolean {
    return !this.userForm.pristine;
  }

  /**
   * Valida un control específico del formulario del usuario.
   * Comprueba si el control especificado es inválido y ha sido tocado.
   * @param controlName El nombre del control que se va a validar.
   * @returns Verdadero si el control es inválido y ha sido tocado, de lo contrario, indefinido.
   */
  public isFormControlInvalid(controlName: string): boolean | undefined {
    return (
      this.userForm.get(controlName)?.invalid &&
      this.userForm.get(controlName)?.touched
    );
  }
}
