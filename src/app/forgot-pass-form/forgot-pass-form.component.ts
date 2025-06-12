import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-forgot-pass-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-pass-form.component.html',
  styleUrl: './forgot-pass-form.component.css'
})
export class ForgotPassFormComponent {
  static readonly API_URL = `${environment.apiBaseUrl}`;

  message: string = '';
  success = false;
  error = false;
  forgotpassForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.forgotpassForm = this.fb.group({
      emailOrUsername: ['']
    });
  }

  handleForm() {
    this.http.post<{ message: string }>(`${environment.apiBaseUrl}/auth/forgot`, this.forgotpassForm.value)
      .pipe(
        tap((result) => {
          this.message = result.message;
          this.success = true;
          this.error = false;
          this.forgotpassForm.reset();
        }),
        catchError((error: HttpErrorResponse) => {
          this.error = true;
          this.success = false;
          this.message = error.error && error.error.message
            ? error.error.message
            : 'Unbekannter Fehler. Bitte versuche es erneut.';
          return of(null);
        })
      )
      .subscribe();
  }
}
