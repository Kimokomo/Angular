/// <reference types="google.accounts" />

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-google-login-component',
  standalone: true,
  imports: [],
  templateUrl: './google-login-component.component.html',
  styleUrl: './google-login-component.component.css'
})
export class GoogleLoginComponent {

  static readonly API_URL = `${environment.apiBaseUrl}`;


  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Initialisiere Google Login
    google.accounts.id.initialize({
      client_id: '274943667956-m61snb3jq17mkm381bukgjte70jgn9ik.apps.googleusercontent.com',
      callback: (response: google.accounts.id.CredentialResponse) => this.handleCredentialResponse(response),
    });

    // Button rendern
    google.accounts.id.renderButton(
      document.getElementById('googleButton')!,
      {
        type: 'standard',
        theme: 'outline',
        size: 'large'
      }
    );

    // One-Tap Login anzeigen
    google.accounts.id.prompt();
  }




  handleCredentialResponse(response: google.accounts.id.CredentialResponse) {
    const idToken = response.credential;

    this.http.post<{ token: string }>(`${environment.apiBaseUrl}/auth/google`, { idToken })
      .pipe(
        tap(res => {
          localStorage.setItem('jwt_token', res.token);
        }),
        switchMap(() => this.authService.fetchUserInfo())
      )
      .subscribe({
        next: () => {
          console.log('Google Login erfolgreich – Benutzer eingeloggt!');
          //Weiterleitung nach Login
          this.router.navigate(['/member/profile']);
        },
        error: err => {
          console.error('Fehler beim Google-Login:', err);
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('userInfo');
        }
      });
  }
}
