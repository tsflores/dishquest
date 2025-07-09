import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { FooterComponent } from '../footer/footer.component';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [NavigationComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private http: HttpClient, private router: Router) { }


  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post<{ token: string }>('/api/auth/login', this.loginForm.value)
        .subscribe({
          next: (res) => {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/dishquest']); // on successful login, send to home page
          },
          error: (err) => {
            console.error('Login failed', err);
          }
        });
    }
  }
}
