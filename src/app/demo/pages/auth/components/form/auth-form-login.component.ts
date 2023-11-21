import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { IAuth } from 'src/app/demo/api/interfaces/auth.interface';
import { AuthService } from 'src/app/demo/api/services/auth.service';
import { TokenService } from 'src/app/demo/api/services/token.service';

@Component({
  selector: 'app-auth-form-login',
  templateUrl: './auth-form-login.component.html',
})
export class AuthFormLoginComponent {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly tokenService: TokenService
  ) {}

  public loginForm: FormGroup = this.buildForm();

  public ngOnInit(): void {}

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  public login(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (data: IAuth) => {
          this.tokenService.setToken(data.token);
          this.router.navigate(['/cnet']);
        },
        error: (e: any) => {
          if (e.status === 404) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Usuario o contraseña incorrectos',
            });
          }
        },
      });
    }
  }
}
