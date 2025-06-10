import { HttpClient } from '@angular/common/http';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
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
    const loginUrl = `${environment.apiBaseUrl}/auth/login`;
    const userInfoUrl = `${environment.apiBaseUrl}/auth/member/userinfo`;

    return this.http.post<{ token: string }>(loginUrl, { username, password }).pipe(
      switchMap(({ token }) => {
        sessionStorage.setItem(this.tokenKey, token);
        return this.http.get<UserInfo>(userInfoUrl);
      }),
      tap(userInfo => {
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      }),
      map(() => true),
      catchError(() => {
        sessionStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem('userInfo');
        return of(false);
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

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(this.tokenKey);
  }
}
