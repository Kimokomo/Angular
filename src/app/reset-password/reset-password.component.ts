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
            const hasFieldErrors = Object.entries(err.error).some(([key, _]) => key !== 'message');

            if (hasFieldErrors) {
              Object.entries(err.error).forEach(([field, message]) => {
                const controlName = field.split('.').pop() ?? field;
                if (field !== 'message' && this.resetPassForm.controls[controlName]) {
                  this.resetPassForm.controls[controlName].setErrors({ backend: message });
                }
              });

              this.message = err.error.message ?? 'Ein Validierungsfehler ist aufgetreten.';
            } else if (err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Unbekannter Fehler. Bitte versuche es erneut.';
            }
          } else {
            this.message = 'Unbekannter Fehler. Bitte versuche es erneut.';
          }

          return of(null);
        })
      )
      .subscribe();
  }

}

