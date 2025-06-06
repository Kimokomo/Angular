import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-register-user-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-user-login-form.component.html',
  styleUrl: './register-user-login-form.component.css'
})
export class RegisterUserLoginFormComponent {

  static readonly API_URL = `${environment.apiBaseUrl}`;

  message: string = '';

  registerForm: FormGroup;
  success = false;
  error = false;

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstname: [''],
      lastname: [''],
      age: [''],
      dateOfBirth: ['']
    });
  }

  register() {
    if (this.registerForm.valid) {
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
  }
}
