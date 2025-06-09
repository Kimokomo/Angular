import { HttpClient } from '@angular/common/http';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserInfo } from '../models/userinfo';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static readonly API_URL = `${environment.apiBaseUrl}`;


  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) { }


  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(`${environment.apiBaseUrl}/auth/login`, { username, password }).pipe(
      tap(response => {
        sessionStorage.setItem(this.tokenKey, response.token);
      }),
      // Nach dem Speichern des Tokens, Userinfos abrufen
      switchMap(() => this.fetchUserInfo()),
      // fetchUserInfo() liefert z.B. UserInfo, wir mappen es auf true
      map(() => true),
      catchError(() => {
        sessionStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem('userInfo'); // Userinfos entfernen falls vorhanden
        return of(false);
      })
    );
  }


  fetchUserInfo() {
    return this.http.get<UserInfo>(`${environment.apiBaseUrl}/auth/member/userinfo`).pipe(
      tap(userInfo => {
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      })
    );
  }

  getUserRole(): string | null {
    const userInfo = sessionStorage.getItem('userInfo');
    if (!userInfo) return null;
    try {
      return JSON.parse(userInfo).role || null;
    } catch {
      return null;
    }
  }


  isSuperAdmin(): boolean {
    return this.getUserRole() === 'superadmin';
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'admin' || role === 'superadmin';
  }

  isMember(): boolean {
    const role = this.getUserRole();
    return role === 'user' || this.isAdmin() || this.isSuperAdmin();
  }

  // wird in der app.component.ts verwendet
  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  // wird in der Guard verwendet
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(this.tokenKey);
  }

  // wird beim Interceptor verwendet
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  getJwtExpirationInMillis(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // JWT Token Aufbau: <HEADER>.<PAYLOAD>.<SIGNATURE>
      // hole Payload aus dem JWT und dekodier es mit atob() zu einem normalen JSON-String
      const payload = JSON.parse(atob(token.split('.')[1]));
      return typeof payload.exp === 'number'
        ? payload.exp * 1000 // Sek. → Millisekunden
        : null;              // Kein gültiges Ablaufdatum
    } catch (error) {
      console.error('JWT-Dekodierung fehlgeschlagen:', error);
      return null;
    }
  }
}
