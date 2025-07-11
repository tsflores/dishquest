import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { FooterComponent } from '../footer/footer.component';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [NavigationComponent, FooterComponent, ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });
    
    // Clear any previous error messages
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const credentials = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          // AuthService already handles token storage and user state
          console.log('Login successful', response);
          this.router.navigate(['/']); // Navigate to home page on successful login
        },
        error: (error) => {
          console.error('Login failed', error);
          // Set user-friendly error message
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password. Please try again.';
            this.isSubmitting = false;
            this.loginForm.reset();
          } else if (error.status === 0) {
            this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
            this.isSubmitting = false;
            this.loginForm.reset();
          } else {
            this.errorMessage = error.error?.message || 'Login failed. Please try again.';
            this.isSubmitting = false;
            this.loginForm.reset();
          }
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}