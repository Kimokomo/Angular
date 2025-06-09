/// <reference types="google.accounts" />

import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DOCUMENT } from '@angular/common';
import { UserInfo } from '../models/userinfo';
import { GoogleLoginService } from '../services/google-login.service';

@Component({
  selector: 'app-google-login-component',
  standalone: true,
  imports: [],
  templateUrl: './google-login-component.component.html',
  styleUrl: './google-login-component.component.css'
})
export class GoogleLoginComponent {

  readonly googleClientId = environment.googleClientId;
  static readonly API_URL = `${environment.apiBaseUrl}`;

  constructor(
    private googleLoginService: GoogleLoginService,
    @Inject(DOCUMENT) private document: Document
  ) { }


  async ngAfterViewInit(): Promise<void> {

    await this.googleLoginService.addGoogleScript();

    // Google Identity Services initialisieren
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: google.accounts.id.CredentialResponse) => this.googleLoginService.handleCredentialResponse(response),
    });


    // Google Login Button rendern
    google.accounts.id.renderButton(
      this.document.getElementById('googleButton')!,
      {
        type: 'standard',
        theme: 'outline',
        size: 'large'
      }
    );

    // One Tap Prompt anzeigen
    google.accounts.id.prompt();
  }

}