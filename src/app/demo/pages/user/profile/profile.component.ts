import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TokenService } from 'src/app/demo/api/services/token.service';
import { UserService } from 'src/app/demo/api/services/user.service';
import { timer } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: Router,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  public profileForm: FormGroup = this.buildProfileForm();

  /**
   * Construye y devuelve un FormGroup para el formulario de perfil de usuario.
   * Este FormGroup contiene controles para capturar la información del perfil del usuario,
   * aplicando validaciones a cada campo según los requisitos especificados.
   */
  private buildProfileForm(): FormGroup {
    return this.formBuilder.group({
      fullname: [
        this.tokenService.getUserFullname(),
        [Validators.required, Validators.pattern(/^[^\s]*(\s[^\s]*){1,2}$/)],
      ],
      password: [null, [Validators.required]],
      newPassword: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/),
        ],
      ],
    });
  }

  /**
   * Actualiza los campos del perfil de usuario según lo definido por los requisitos.
   * Se muestra un cuadro de diálogo de confirmación antes de actualizar el perfil.
   */
  public updateUserProfile(): void {
    if (this.profileForm.valid) {
      const { password, newPassword } = this.profileForm.value;
      if (password === newPassword) {
        this.confirmationService.confirm({
          message:
            'La contraseña actual y la nueva contraseña son iguales.<br> Por favor, elija una contraseña nueva diferente.',
          header: 'INFORMACIÓN',
          icon: 'pi pi-info-circle',
          rejectVisible: false,
          acceptVisible: false,
          closeOnEscape: true,
        });
        return;
      }
      this.confirmationService.confirm({
        message: '¿Estás seguro de que deseas cambiar tu contraseña?',
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
            .updateProfile(
              Number(this.tokenService.getUserId()),
              this.profileForm.value
            )
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Operación exitosa',
                  detail:
                    'Se modificó su contraseña. Será redirigido al inicio de sesión.',
                });
                this.tokenService.deleteToken();
                timer(2500).subscribe(() => {
                  this.route.navigate(['/auth/login']);
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
                    detail: 'Ocurrió un error al actualizar el usuario',
                  });
                }
              },
            });
        },
      });
    }
  }
}
