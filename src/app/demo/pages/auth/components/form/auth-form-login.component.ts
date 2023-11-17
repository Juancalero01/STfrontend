import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-form-login',
  templateUrl: './auth-form-login.component.html',
})
export class AuthFormLoginComponent {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
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
    alert(`Login,${JSON.stringify(this.loginForm.value)}`);
    this.router.navigate(['/cnet']);
  }
}
