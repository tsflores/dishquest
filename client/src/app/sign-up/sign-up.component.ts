import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { FooterComponent } from '../footer/footer.component';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  imports: [NavigationComponent, FooterComponent, ReactiveFormsModule, NgIf],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {

  signupForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required]),
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    })

    //clear any previous messages upon initialization
    this.errorMessage = '';
    this.successMessage = '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Custom validator for password strength
  passwordStrengthValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    //const hasSpecialChar = /[!#?$*]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

    if (!passwordValid) {
      return { pattern: true };
    }
    return null;
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Clear the error if passwords match
      if (confirmPassword.errors && confirmPassword.errors['passwordMismatch']) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = {
        name: this.signupForm.get('name')?.value,
        email: this.signupForm.get('email')?.value,
        username: this.signupForm.get('username')?.value,
        password: this.signupForm.get('password')?.value
      };

      this.authService.register(formData).subscribe({
        next: (response) => {
          this.successMessage = 'Account created successfully!';
          this.signupForm.reset();

          // Redirect to home page after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'An error occurred during registration. Please try again.';
          console.error('Registration error:', error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signupForm.controls).forEach(key => {
        this.signupForm.get(key)?.markAsTouched();
      });
    }
  }

  getFormControlError(controlName: string): any {
    const control = this.signupForm.get(controlName);
    return control?.errors && (control.dirty || control.touched) ? control.errors : null;
  }

}
