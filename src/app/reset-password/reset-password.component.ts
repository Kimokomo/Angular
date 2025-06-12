import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { catchError, of, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  static readonly API_URL = `${environment.apiBaseUrl}`;

  message: string = '';
  success = false;
  error = false;
  resetPassForm!: FormGroup

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }


  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token') || '';

    this.resetPassForm = this.fb.group({
      token: [token],
      newPassword: [''],
      confirmNewPassword: ['']
    });
  }

  handleResetPassForm() {
    this.http.post<{ message: string }>(`${environment.apiBaseUrl}/auth/reset-password`, this.resetPassForm.value)
      .pipe(
        tap((result) => {
          this.message = result.message;
          this.success = true;
          this.error = false;
          this.resetPassForm.reset();
        }),
        catchError((err: HttpErrorResponse) => {
          this.success = false;
          this.error = true;

          if (err.error && typeof err.error === 'object') {
            const entries = Object.entries(err.error);

            entries.forEach(([field, message]) => {
              const controlName = field.split('.').pop() ?? field;
              if (this.resetPassForm.controls[controlName]) {
                this.resetPassForm.controls[controlName].setErrors({ backend: message });
              }
            });

            this.message = 'Ein Validierungsfehler ist aufgetreten.';
          } else if (err.error?.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Unbekannter Fehler. Bitte versuche es erneut.';
          }

          return of(null);
        })
      ).subscribe();
  }
}

