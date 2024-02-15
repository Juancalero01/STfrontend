import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/demo/api/services/auth.service';
import { TokenService } from 'src/app/demo/api/services/token.service';
import { UserService } from 'src/app/demo/api/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly messageService: MessageService
  ) {}

  public profileForm: FormGroup = this.buildForm();

  public ngOnInit(): void {}

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      fullname: [
        this.tokenService.getUserFullname(),
        [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)],
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

  //VERIFICAR POR QUE NO ANDA.
  public updateProfile(): void {
    this.userService
      .updateProfile(
        Number(this.tokenService.getUserId()),
        this.profileForm.value
      )
      .subscribe({
        next: () => {
          console.log('funciono');
        },
        error: () => {
          console.log('no funciono');
        },
      });
  }
}
