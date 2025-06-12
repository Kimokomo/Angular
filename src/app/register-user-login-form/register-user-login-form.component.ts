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
        catchError((err: HttpErrorResponse) => {
          this.success = false;
          this.error = true;

          if (err.error && typeof err.error === 'object') {
            const entries = Object.entries(err.error);

            entries.forEach(([field, message]) => {
              // Feldname direkt verwenden, da Backend keine Prefixe mehr sendet
              if (this.registerForm.controls[field]) {
                this.registerForm.controls[field].setErrors({ backend: message });
              }
            });

            // Nur eine allgemeine Meldung, falls keine feldspezifischen Fehler da sind (Altersprüfung)
            if (entries.length === 1) {
              this.message = entries[0][1] as string;
            }
          } else if (err.error?.message) {
            this.message = err.error.message;
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
