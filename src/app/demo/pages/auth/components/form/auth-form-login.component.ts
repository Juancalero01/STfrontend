import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-form-login',
  templateUrl: './auth-form-login.component.html',
})
export class AuthFormLoginComponent {
  constructor(private readonly formBuilder: FormBuilder) {}

  public loginForm: FormGroup = this.buildForm();

  public ngOnInit(): void {}

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  public login(): void {
    console.log(this.loginForm.value);
  }
}
