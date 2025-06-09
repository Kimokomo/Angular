import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';
import { switchMap, tap } from 'rxjs';
import { UserInfo } from '../models/userinfo';

@Injectable({
  providedIn: 'root'
})
export class GoogleLoginService {

  readonly googleClientId = environment.googleClientId;
  static readonly API_URL = `${environment.apiBaseUrl}`;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) { }

  /**
 * Lädt das Google Identity Script dynamisch nach, falls noch nicht eingebunden.
 * 
 * Falls das Script bereits im index.html per
 * <script src="https://accounts.google.com/gsi/client" async defer></script>
 * eingebunden ist, wird es hier nicht nochmal geladen.
 * 
 * return ein Promise, das erst erfüllt wird, wenn das Script komplett geladen ist 
 */
  public addGoogleScript(): Promise<void> {
    return new Promise(resolve => {
      const existingScript = this.document.getElementById('google-client');
      if (existingScript) {
        resolve(); // Script schon da, dann Promise dirket auflösen
        return;
      }

      const script = this.document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'google-client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(); // Script geladen dann Promise auflösen

      this.document.body.appendChild(script);
    });
  }


  /**
   * Callback, wenn Google Login ein Token liefert.
   * Sendet Token ans Backend, speichert JWT und Userdaten in der sessionstorage
   */
  public handleCredentialResponse(response: google.accounts.id.CredentialResponse): void {
    const idToken = response.credential;

    this.http.post<{ token: string }>(`${environment.apiBaseUrl}/auth/google`, { idToken })
      .pipe(
        tap(res => sessionStorage.setItem('jwt_token', res.token)),
        switchMap(() => this.http.get<UserInfo>(`${environment.apiBaseUrl}/auth/member/userinfo`).pipe(
          tap(userInfo => sessionStorage.setItem('userInfo', JSON.stringify(userInfo)))
        ))
      )
      .subscribe({
        next: () => this.router.navigate(['/member/profile']),
        error: err => {
          console.error('Fehler beim Google-Login:', err);
          sessionStorage.removeItem('jwt_token');
          sessionStorage.removeItem('userInfo');
        }
      });
  }
}
