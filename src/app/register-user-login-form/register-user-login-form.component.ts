import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-register-user-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-user-login-form.component.html',
  styleUrl: './register-user-login-form.component.css'
})
export class RegisterUserLoginFormComponent implements OnInit {

  static readonly API_URL = `${environment.apiBaseUrl}`;

  message: string = '';
  success = false;
  error = false;
  showPassword = false;
  registerForm!: FormGroup;


  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: [''],
      username: [''],
      password: [''],
      firstname: [''],
      lastname: [''],
      age: [''],
      dateOfBirth: ['']
    });
  }

  register() {
    this.http.post<{ message: string }>(`${environment.apiBaseUrl}/auth/register`, this.registerForm.value)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.error = true;
          this.success = false;

          if (error.error && error.error.message) {
            this.message = error.error.message;
          } else {
            this.message = 'Unbekannter Fehler. Bitte versuche es erneut.';
          }
          return of(null);
        })
      )
      .subscribe((result: { message: string } | null) => {
        if (result && result.message) {
          this.message = result.message;
          this.success = true;
          this.error = false;
          this.registerForm.reset();
        }
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
