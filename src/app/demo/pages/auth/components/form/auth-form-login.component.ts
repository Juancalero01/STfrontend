import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IAuth } from 'src/app/demo/api/interfaces/auth.interface';
import { AuthService } from 'src/app/demo/api/services/auth.service';
import { TokenService } from 'src/app/demo/api/services/token.service';

@Component({
  selector: 'app-auth-form-login',
  templateUrl: './auth-form-login.component.html',
})
export class AuthFormLoginComponent {
  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly messageService: MessageService
  ) {}

  public loginForm: FormGroup = this.buildLoginForm();

  /**
    Construcción de los campos y validaciones del formulario de inicio de sesión.
    Esta función crea un formulario para el inicio de sesión con campos para el nombre de usuario y la contraseña, aplicando las   validaciones necesarias.
  */
  private buildLoginForm(): FormGroup {
    return this.formBuilder.group({
      username: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)],
      ],
      password: [null, [Validators.required]],
    });
  }

  /**
    Esta función realiza la verificación de las credenciales del usuario al intentar iniciar sesión.
    En caso de error, muestra un mensaje adecuado según el estado de la respuesta HTTP.
    Si la autenticación es exitosa, guarda el token de autenticación y redirige al usuario a la página principal.
  */
  public login(): void {
    this.authService
      .login(this.loginForm.value)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          let message = 'Se produjo un inconveniente';

          if (err.status === 404) {
            message = 'No se encontró el usuario solicitado';
          } else if (err.status === 403) {
            message = 'La cuenta de usuario ha sido desactivada';
          } else if (err.status === 401) {
            message = 'Credenciales inválidas';
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
          });

          return of(null);
        })
      )
      .subscribe({
        next: (res: IAuth | null) => {
          if (res) {
            this.tokenService.setToken(res.token, res.user);
            this.router.navigate(['/cnet']);
          }
        },
      });
  }
}
