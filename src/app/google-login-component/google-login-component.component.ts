/// <reference types="google.accounts" />

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-google-login-component',
  standalone: true,
  imports: [],
  templateUrl: './google-login-component.component.html',
  styleUrl: './google-login-component.component.css'
})
export class GoogleLoginComponent {

  static readonly API_URL = `${environment.apiBaseUrl}`;


  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
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

    // Optional: One-Tap Login anzeigen
    google.accounts.id.prompt();
  }


  handleCredentialResponse(response: google.accounts.id.CredentialResponse) {
    const idToken = response.credential;

    // An dein Backend schicken (z. B. /auth/google)
    this.http.post(`${environment.apiBaseUrl}/auth/google`, { idToken }).subscribe({
      next: (data) => {
        console.log('Login erfolgreich, JWT vom Backend:', data);
        // JWT im LocalStorage speichern etc.
      },
      error: (err) => {
        console.error('Fehler beim Login:', err);
      },
    });
  }

}
