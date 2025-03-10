import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { CustomValidators } from '@utils/validators';
import { RequestStatus } from '@models/rerquest-status.model';
import { AuthService } from '@services/auth.service';
@Component({
    selector: 'app-register-form',
    templateUrl: './register-form.component.html',
    standalone: false
})
export class RegisterFormComponent {
  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],// Add a minimum length of 8 characters
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [ CustomValidators.MatchValidator('password', 'confirmPassword') ]
  });
  status: RequestStatus = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  register() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, email, password } = this.form.getRawValue();
      this.authService.register(name, email, password).subscribe({
        next: () => {
          this.status = 'success';
          this.router.navigate(['/login']);
        },
        error: (error) =>{
          this.status = 'failed'
          console.log(error);
        } 
      })
    } else {
      this.form.markAllAsTouched();
    }
  }
}
