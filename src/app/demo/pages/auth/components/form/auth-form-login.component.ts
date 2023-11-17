import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IAuth } from 'src/app/demo/api/interfaces/auth.interface';
import { AuthService } from 'src/app/demo/api/services/auth.service';
import { UserService } from 'src/app/demo/api/services/user.service';

@Component({
  selector: 'app-auth-form-login',
  templateUrl: './auth-form-login.component.html',
})
export class AuthFormLoginComponent {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly cookieService: CookieService
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
          this.cookieService.set('token', data.token);
        },
        error: () => {},
        complete: () => {
          this.router.navigate(['/cnet']);
        },
      });
    }
  }
}
