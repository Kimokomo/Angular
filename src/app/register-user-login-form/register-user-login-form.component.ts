import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-register-user-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-user-login-form.component.html',
  styleUrl: './register-user-login-form.component.css'
})
export class RegisterUserLoginFormComponent {

  registerForm: FormGroup;
  success = false;
  error = false;

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
      this.http.post('https://slicy.it.com/api/auth/register', this.registerForm.value)
        .pipe(
          catchError(() => {
            this.error = true;
            this.success = false;
            return of(null);
          })
        )
        .subscribe(result => {
          if (result) {
            this.success = true;
            this.error = false;
            this.registerForm.reset();
          }
        });
    }
  }
}
