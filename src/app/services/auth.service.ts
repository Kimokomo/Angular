import { HttpClient } from '@angular/common/http';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserInfo } from '../models/userinfo';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) { }


  // wird im login.component.ts verwendet
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>('https://slicy.it.com/api/auth/login', { username, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
      }),
      // Nach dem Speichern des Tokens, Userinfos abrufen
      switchMap(() => this.fetchUserInfo()),
      // fetchUserInfo() liefert z.B. UserInfo, wir mappen es auf true
      map(() => true),
      catchError(() => {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem('userInfo'); // Userinfos entfernen falls vorhanden
        return of(false);
      })
    );
  }


  fetchUserInfo() {
    return this.http.get<UserInfo>('https://slicy.it.com/api/auth/member/userinfo').pipe(
      tap(userInfo => {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      })
    );
  }

  getUserRole(): string | null {
    const userInfo = localStorage.getItem('userInfo');
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
    localStorage.removeItem(this.tokenKey);
  }

  // wird in der Guard verwendet
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // wird beim Interceptor verwendet
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

}
